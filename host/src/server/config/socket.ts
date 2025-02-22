import { io as createIo, Socket } from "socket.io-client";
import { events } from "../../../../events";
import { globalConfig } from "@/index";
import * as operation from "../services/socket";
import * as validation from "../validations/socket";

let io: Socket | undefined = undefined;

const connectToSocket = () => {
	const _io = createIo(globalConfig.serverUrl);

	_io.on(events.HOST_CONNECTION, (msg: string) => {
		console.log(msg);
	});

	_io.on(events.HOST_START, async (msg: any) => {
		const { success, data } = validation.operationValidation.safeParse(msg);
		if (!success) return;
		await operation.startScraper(data.passwordHash, data.data);
	});

	_io.on(events.HOST_STOP, async (msg: any) => {
		const { success, data } = validation.operationValidation.safeParse(msg);
		if (!success) return;
		await operation.stopScraper(data.passwordHash, data.data);
	});

	_io.on(events.HOST_TERMINATE, async (msg: any) => {
		const { success, data } = validation.operationValidation.safeParse(msg);
		if (!success) return;
		await operation.terminateScraper(data.passwordHash, data.data);
	});

	_io.on(events.HOST_UPDATE_INTERVAL, async (msg: any) => {
		const { success, data } = validation.updateIntervalSpeedValidation.safeParse(msg);
		if (!success) return;
		await operation.changeIntervalSpeed(data.passwordHash, data.data, data.timer);
	});

	_io.on(events.HOST_UPDATE_QUERY, async (msg: any) => {
		const { success, data } = validation.updateQueryValidation.safeParse(msg);
		if (!success) return;
		await operation.changeQuery(data.passwordHash, data.data, data.query);
	});

	io = _io;
};

export { connectToSocket, io };
