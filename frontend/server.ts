import { Socket } from "socket.io-client";
import { events } from "../events";

const { createServer } = require("http");

const next = require("next");
const { Server } = require("socket.io");

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
	const httpServer = createServer(handler);

	const io = new Server(httpServer);

	io.on("connection", (socket: Socket) => {
		console.log("Socket connected ", socket.id);

		socket.on("host:connection", (msg) => {
			console.log("Message received:", msg);
		});

		socket.on(events.HOST_NEW_DATA, (data) => console.log(data));

		socket.on("disconnect", () => {
			console.log("A client disconnected");
		});
	});

	httpServer
		.once("error", (err: any) => {
			console.error(err);
			process.exit(1);
		})
		.listen(port, () => {
			console.log(`> Ready on http://${hostname}:${port}`);
		});
});
