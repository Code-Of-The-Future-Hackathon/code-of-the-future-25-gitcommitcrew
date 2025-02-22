import { io as createIo, Socket } from "socket.io-client";
import { events } from "../../../events";
import { config } from "@/index";
import * as op from "./handlers";
import * as validation from "./validation";

let io: Socket | undefined = undefined;

const connectToSocket = () => {
	const _io = createIo(config?.serverUrl);

	_io.on(events.HOST_CONNECTION, (msg: string) => {
		console.log(msg);
	});

	_io.on(events.HOST_START, async (msg: any) => {
		const { success, data } = validation.operation.safeParse(msg);
		if (!success) return;

		await op.startScraper(data.passwordHash, data.data);
	});

	_io.on(events.HOST_STOP, async (msg: any) => {
		const { success, data } = validation.operation.safeParse(msg);
		if (!success) return;

		await op.stopScraper(data.passwordHash, data.data);
	});

	_io.on(events.HOST_TERMINATE, async (msg: any) => {
		const { success, data } = validation.operation.safeParse(msg);
		if (!success) return;

		await op.terminateScraper(data.passwordHash, data.data);
	});

	_io.on(events.HOST_UPDATE_INTERVAL, async (msg: any) => {
		const { success, data } = validation.updateTimer.safeParse(msg);
		if (!success) return;

		for (const type of data.data) {
			await op.changeIntervalSpeed(type, data.isFast);
		}
	});

	_io.on(events.HOST_UPDATE_QUERY, async (msg: any) => {
		const { success, data } = validation.updateQuery.safeParse(msg);
		if (!success) return;

		await op.changeQuery(data.passwordHash, data.data, data.query);
	});

	io = _io;
};

export { connectToSocket, io };
