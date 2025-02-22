import { Client } from "ssh2";
import { globalConfig } from "@/index";
import axios from "axios";

export class SSHTunnelService {
	private tunnel: Client | null = null;
	private retryTimeout: number = 30000;

	constructor(
		private jumpServer: string,
		private jumpServerPort: number = 2222,
	) {}

	async start() {
		await this.establishTunnel();
	}

	private async establishTunnel() {
		if (this.tunnel) {
			this.tunnel.end();
		}

		this.tunnel = new Client();

		this.tunnel.on("ready", () => {
			console.log("Tunnel connection established");

			if (!this.tunnel) return;

			// Request port forwarding
			this.tunnel.forwardIn("127.0.0.1", 0, async (err, port) => {
				if (err) {
					console.error("Port forwarding error:", err);
					this.retryTunnel();
					return;
				}

				try {
					// Update tunnel status in frontend database
					await axios.post(`${globalConfig.serverUrl}/api/hosts/tunnel`, {
						hostId: globalConfig.hostname,
						tunnelPort: port,
						active: true,
					});

					console.log(`Port forwarding established on port ${port}`);
				} catch (error) {
					console.error("Failed to update tunnel status:", error);
					this.retryTunnel();
				}
			});
		});

		this.tunnel.on("error", (err) => {
			console.error("Tunnel error:", err);
			this.retryTunnel();
		});

		this.tunnel.on("close", async () => {
			console.log("Tunnel closed");

			try {
				// Update tunnel status in frontend database
				await axios.post(`${globalConfig.serverUrl}/api/hosts/tunnel`, {
					hostId: globalConfig.hostname,
					tunnelPort: null,
					active: false,
				});
			} catch (error) {
				console.error("Failed to update tunnel status:", error);
			}

			this.retryTunnel();
		});

		try {
			await new Promise<void>((resolve, reject) => {
				this.tunnel!.connect({
					host: this.jumpServer,
					port: this.jumpServerPort,
					username: globalConfig.hostname,
					password: globalConfig.password,
					readyTimeout: 30000,
					keepaliveInterval: 10000,
					keepaliveCountMax: 3,
				});

				this.tunnel!.once("ready", resolve);
				this.tunnel!.once("error", reject);
			});
		} catch (error) {
			console.error("Failed to establish tunnel:", error);
			this.retryTunnel();
		}
	}

	private retryTunnel() {
		setTimeout(() => {
			this.establishTunnel();
		}, this.retryTimeout);
	}

	async stop() {
		if (this.tunnel) {
			try {
				// Update tunnel status in frontend database
				await axios.post(`${globalConfig.serverUrl}/api/hosts/tunnel`, {
					hostId: globalConfig.hostname,
					tunnelPort: null,
					active: false,
				});
			} catch (error) {
				console.error("Failed to update tunnel status:", error);
			}

			this.tunnel.end();
			this.tunnel = null;
		}
	}
}
