import { Socket } from "socket.io-client";
import { events, EventData } from "../events";
import { getCurrentSession } from "./lib/auth";
import { db } from "./lib/db";
import { hostTable, systemDataTable } from "./lib/db/schema";
import { eq } from "drizzle-orm";
import { nextEvents } from "./nextEvents";

const { createServer } = require("http");

const next = require("next");
const { Server } = require("socket.io");

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(async () => {
	const httpServer = createServer(handler);

	const io = new Server(httpServer);

	io.on("connection", (socket: Socket) => {
		console.log("Socket connected ", socket.id);

		socket.on("host:connection", (msg) => {
			console.log("Message received:", msg);
		});

		socket.on(events.HOST_NEW_DATA, async (data: EventData) => {
			const host = (
				await db.select().from(hostTable).where(eq(hostTable.mac, data.mac))
			)[0];

			if (host.password === data.passwordHash) {
				console.log("[LOG] password for host is correct. Processing data.");
				const info = (
					await db
						.insert(systemDataTable)
						.values({ data, type: data.type, hostId: host.id })
						.returning()
				)[0];

				console.log("[LOG] created system info ", info.id);
			} else {
				console.log(host.password, data.passwordHash);
				console.log("[LOG] incorrect password for host.");
			}
		});

		socket.on(nextEvents.HOST_OPEN, async ({ hostId }: { hostId: string }) => {
			const data = await db
				.select({ data: systemDataTable.data })
				.from(systemDataTable)
				.where(eq(systemDataTable.hostId, hostId));

			console.log("[LOG] Client opened host", hostId, data.length);
			socket.emit(
				nextEvents.DATA_SEND,
				data.map((d) => d.data),
			);
		});

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
