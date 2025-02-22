import { io as createIo, Socket } from "socket.io-client";
import { events } from "../../../../events";
import { globalConfig } from "@/index";

let io: Socket | undefined = undefined;

const connectToSocket = () => {
	const _io = createIo(globalConfig.serverUrl);

	_io.on(events.HOST_CONNECTION, (msg: string) => {
		console.log(msg);
	});

	io = _io;
};

export { connectToSocket, io };
