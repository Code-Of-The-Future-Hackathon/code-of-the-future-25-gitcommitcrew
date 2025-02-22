import { readFileSync } from "fs";
import { Server, utils } from "ssh2";
import { createServer } from "http";
import { WebSocketServer } from "ws";
import axios from "axios";
import { timingSafeEqual } from "crypto";

// Create HTTP server for WebSocket
const httpServer = createServer();
const wss = new WebSocketServer({ server: httpServer });

interface TunnelSession {
	hostId: string;
	assignedPort: number;
	sshStream?: any;
}

const activeTunnels = new Map<string, TunnelSession>();

const hostKeys = [
	readFileSync("/path/to/ssh_host_rsa_key"), // RSA key
	readFileSync("/path/to/ssh_host_ecdsa_key"), // ECDSA key
	readFileSync("/path/to/ssh_host_ed25519_key"), // ED25519 key
];

const sshServer = new Server(
	{
		hostKeys,
	},
	async (client) => {
		console.log("Client connected!");
		let hostId: string | null = null;

		client.on("authentication", async (ctx) => {
			try {
				// Verify host credentials against frontend API
				const response = await axios.get(
					`${process.env.FRONTEND_URL}/api/hosts/tunnel?hostId=${ctx.username}`,
				);

				const host = response.data.data;

				if (!host) {
					return ctx.reject();
				}

				switch (ctx.method) {
					case "password":
						if (await Bun.password.verify(ctx.password, host.tunnelSecret)) {
							hostId = ctx.username;
							ctx.accept();
						} else {
							ctx.reject();
						}
						break;
					default:
						ctx.reject();
				}
			} catch (error) {
				console.error("Authentication error:", error);
				ctx.reject();
			}
		});

		client.on("ready", () => {
			console.log("Client authenticated!");

			// Handle port forwarding requests
			client.on("request", (accept, reject, name, info: any) => {
				if (!accept || !reject) return;

				if (name === "tcpip-forward" && hostId) {
					const assignedPort = Math.floor(
						Math.random() * (65535 - 1024) + 1024,
					);

					activeTunnels.set(hostId, {
						hostId,
						assignedPort,
					});

					accept(assignedPort);

					// Update frontend about tunnel status
					axios
						.post(`${process.env.FRONTEND_URL}/api/hosts/tunnel`, {
							hostId,
							tunnelPort: assignedPort,
							active: true,
						})
						.catch(console.error);
				} else {
					reject();
				}
			});

			// Handle direct-tcpip requests (incoming SSH connections)
			client.on("tcpip", (accept, reject, info) => {
				const tunnel = activeTunnels.get(hostId!);
				if (!tunnel) {
					return reject();
				}

				const stream = accept();
				tunnel.sshStream = stream;

				// Notify any waiting WebSocket connections
				wss.clients.forEach((ws) => {
					if (ws.readyState === ws.OPEN && (ws as any).hostId === hostId) {
						ws.send(JSON.stringify({ type: "ready" }));
					}
				});
			});
		});

		client.on("close", () => {
			if (hostId && activeTunnels.has(hostId)) {
				const tunnel = activeTunnels.get(hostId)!;
				if (tunnel.sshStream) {
					tunnel.sshStream.end();
				}
				activeTunnels.delete(hostId);

				// Update frontend about tunnel status
				axios
					.post(`${process.env.FRONTEND_URL}/api/hosts/tunnel`, {
						hostId,
						tunnelPort: null,
						active: false,
					})
					.catch(console.error);
			}
		});
	},
);

// Handle WebSocket connections from the web terminal
wss.on("connection", (ws, req) => {
	const url = new URL(req.url!, `http://${req.headers.host}`);
	const hostId = url.searchParams.get("hostId");
	const token = url.searchParams.get("token");

	if (!hostId || !token) {
		ws.close();
		return;
	}

	// Verify token with frontend
	axios
		.get(
			`${process.env.FRONTEND_URL}/api/devices/${hostId}/ssh/verify?token=${token}`,
		)
		.then((response) => {
			if (!response.data.valid) {
				ws.close();
				return;
			}

			(ws as any).hostId = hostId;
			const tunnel = activeTunnels.get(hostId);

			if (tunnel?.sshStream) {
				// Pipe WebSocket data to SSH stream and vice versa
				ws.on("message", (data) => {
					tunnel.sshStream.write(data);
				});

				tunnel.sshStream.on("data", (data: Buffer) => {
					if (ws.readyState === ws.OPEN) {
						ws.send(data);
					}
				});

				tunnel.sshStream.on("close", () => {
					ws.close();
				});
			}
		})
		.catch(() => {
			ws.close();
		});
});

sshServer.listen(2222, "0.0.0.0", () => {
	console.log("SSH server listening on port 2222");
});

httpServer.listen(2223, "0.0.0.0", () => {
	console.log("WebSocket server listening on port 2223");
});
