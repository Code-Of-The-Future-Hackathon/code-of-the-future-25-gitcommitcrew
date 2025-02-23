import { Server, Socket } from "socket.io";

import logger from "@logger";
import { Data, EventData, events } from "../../../../events";
import {
	getHostByPasswordHash,
	getUsersFromOrganizationByPasswordHash,
} from "@services/system/system.service";
import { db } from "@config/db";
import { SystemData } from "@services/system/models";

let _io: Server | undefined = undefined;

const userSocketMap = new Map<
	string,
	{ requestedData: Data[]; connection: string }
>();

const hostSocketMap = new Map<string, { connection: string }>();

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
			const socketId = userSocketMap.get(user.id);

			if (!socketId) {
				userSocketMap.set(user.id, {
					requestedData: [],
					connection: socket.id,
				});
			} else {
				socket.disconnect();
				return;
			}
		}

		socket.on(events.HOST_NEW_DATA, async (data: EventData) => {
			const usersOrganization = await getUsersFromOrganizationByPasswordHash(
				data.passwordHash,
			);

			const host = await getHostByPasswordHash(data.passwordHash);

			if (!host) {
				return;
			}

			if (!hostSocketMap.has(host.id)) {
				hostSocketMap.set(host.id, { connection: socket.id });
			}

			if (usersOrganization && usersOrganization.length > 0) {
				for (const { userId } of usersOrganization) {
					const userSocket = userSocketMap.get(userId);
					if (userSocket && userSocket.requestedData.includes(data.type)) {
						emitToSocket(userId, false, events.SERVER_NEW_DATA, {
							hostId: host.id,
							data,
						});
					}
				}
			}

			await db
				.insert(SystemData)
				.values({ hostId: host.id, type: data.type, data });
		});

		socket.on(
			events.CLIENT_REQUEST_DATA,
			async ({ data }: { data: Data[] }) => {
				if (!user) {
					return;
				}
				logger.info("here");

				const socket = userSocketMap.get(user.id);

				if (!socket) {
					return;
				}

				socket.requestedData = data;
			},
		);

		socket.on("disconnect", () => {
			logger.info("Client disconnected");

			if (user) {
				userSocketMap.delete(user.id);
			}
		});

		socket.on("error", (error: Error) => {
			logger.error("Socket error", error);
		});
	});
};

function emitToSocket(
	id: string,
	isHost: boolean,
	eventName: string,
	data: unknown,
) {
	const io = getIO();

	const socket = isHost ? hostSocketMap.get(id) : userSocketMap.get(id);

	if (!socket?.connection) {
		return;
	}

	io?.to(socket.connection).emit(eventName, data);
}

export { setIO, getIO, setupServerListeners, emitToSocket as emitToUser };
