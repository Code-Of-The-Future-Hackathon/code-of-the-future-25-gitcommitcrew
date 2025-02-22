import { io as createIo, Socket } from "socket.io-client";
import { events } from "../../../../events";
import { globalConfig } from "@/index";

// let io: Socket | undefined = undefined;

const connectToSocket = () => {
	const io = createIo(globalConfig.serverUrl);

	io.on(events.HOST_CONNECTION, (msg: string) => {
		console.log(msg);
	});
};

export { connectToSocket };
