import { Server, Socket } from "socket.io";

let _io: Server | undefined = undefined;

const setIO = (io: Server) => {
	_io = io;
};

const getIO = () => {
	return _io;
};

const setupServerListeners = (io: Server) => {
	io.on("connection", (socket: Socket) => {
		io.emit("host:connection", "Connected to host");

		socket.on("message", () => {
			socket.emit("message", "Hello from server");
		});

		socket.on("disconnect", () => {
			socket.emit("message", "Disconnected from server");
		});
	});
};

export { setIO, getIO, setupServerListeners };
