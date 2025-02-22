import { io as createIo, Socket } from "socket.io-client";
import { events } from "../../../../events";
import { globalConfig } from "@/index";
import { changeIntervalSpeed } from "../services/socket";
import { updateIntervalSpeedValidation } from "../validations/socket";

let io: Socket | undefined = undefined;

const connectToSocket = () => {
	const _io = createIo(globalConfig.serverUrl);

	_io.on(events.HOST_CONNECTION, (msg: string) => {
		console.log(msg);
	});

	_io.on(events.HOST_UPDATE_INTERVAL, async (msg: any) => {
		const { success, data } = updateIntervalSpeedValidation.safeParse(msg);

		if (!success) return;

		await changeIntervalSpeed(data.passwordHash, data.data, data.timer);
	});

	io = _io;
};

export { connectToSocket, io };
