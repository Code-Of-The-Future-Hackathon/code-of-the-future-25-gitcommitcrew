import { Server, Socket } from "socket.io";

import logger from "@logger";
import { events } from "../../../../events";

let _io: Server | undefined = undefined;

const userSocketMap = new Map<string, Set<string>>();

const setIO = (io: Server) => {
	_io = io;
};

const getIO = () => {
	return _io;
};

const setupServerListeners = (io: Server) => {
	io.on("connection", (socket: Socket) => {
		logger.info("Client connected");

		const user = (socket.request as unknown as Express.Request).session.user as
			| { id: string }
			| undefined;

		if (user) {
			const socketIds = userSocketMap.get(user.id);

			if (!socketIds) {
				userSocketMap.set(user.id, new Set());
			}

			userSocketMap.get(user.id)?.add(socket.id);
		}

		socket.on(events.HOST_NEW_DATA, (data) => {
			logger.info(data);
		});

		socket.on("disconnect", () => {
			logger.info("Client disconnected");

			if (user) {
				const userSockets = userSocketMap.get(user.id) ?? new Set();

				userSockets.delete(socket.id);

				if (userSockets.size === 0) {
					userSocketMap.delete(user.id);
				} else {
					userSocketMap.set(user.id, userSockets);
				}
			}
		});

		socket.on("error", (error: Error) => {
			logger.error("Socket error", error);
		});
	});
};

function emitToUser(userId: string, eventName: string, data: unknown) {
	const io = getIO();

	const socketIds = userSocketMap.get(userId);

	if (!socketIds) {
		logger.info({ userId }, "User is not connected");
		return;
	}

	for (const socketId of socketIds) {
		io?.to(socketId).emit(eventName, data);
	}
}

export { setIO, getIO, setupServerListeners, emitToUser };
