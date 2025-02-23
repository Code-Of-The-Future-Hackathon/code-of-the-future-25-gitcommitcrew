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

const hostSocketMap = new Map<string, { connection: string }>();

const setIO = (io: Server) => {
	_io = io;
};

const getIO = () => {
	return _io;
};

const setupServerListeners = (io: Server) => {
	const userSocketMap = new Map<
		string,
		{ requestedData: Data[]; connection: string }[]
	>();

	io.on("connection", (socket: Socket) => {
		logger.info(`Client connected: ${socket.id}`);

		const user = (socket.request as unknown as Express.Request).session.user as
			| { id: string }
			| undefined;

		if (user) {
			const userSockets = userSocketMap.get(user.id) ?? [];

			userSockets.push({ requestedData: [], connection: socket.id });

			userSocketMap.set(user.id, userSockets);
		}

		socket.on(events.HOST_NEW_DATA, async (data: EventData) => {
			const usersOrganization = await getUsersFromOrganizationByPasswordHash(
				data.passwordHash,
			);
			const host = await getHostByPasswordHash(data.passwordHash);

			if (!host) {
				return;
			}

			hostSocketMap.set(host.id, { connection: socket.id });

			const createdData = (
				await db
					.insert(SystemData)
					.values({ hostId: host.id, type: data.type, data })
					.returning()
			)[0];

			if (!createdData) {
				return;
			}

			if (usersOrganization && usersOrganization.length > 0) {
				for (const { userId } of usersOrganization) {
					const userSockets = userSocketMap.get(userId);
					if (!userSockets) continue;

					for (const userSocket of userSockets) {
						if (userSocket.requestedData.includes(data.type)) {
							emitToSocket(userSocket.connection, events.SERVER_NEW_DATA, {
								hostId: host.id,
								data: createdData,
							});
						}
					}
				}
			}
		});

		socket.on(events.CLIENT_REQUEST_DATA, ({ data }: { data: Data[] }) => {
			if (!user) return;

			const userSockets = userSocketMap.get(user.id);
			if (!userSockets) return;

			const userSocket = userSockets.find((s) => s.connection === socket.id);
			if (userSocket) {
				userSocket.requestedData = data;
			}

			logger.info(`Socket ${socket.id} requested data: ${data}`);
		});

		socket.on("disconnect", () => {
			logger.info(`Client disconnected: ${socket.id}`);

			if (!user) {
				return;
			}
			const userSockets = userSocketMap.get(user.id);
			if (userSockets) {
				const updatedSockets = userSockets.filter(
					(s) => s.connection !== socket.id,
				);
				if (updatedSockets.length > 0) {
					userSocketMap.set(user.id, updatedSockets);
				} else {
					userSocketMap.delete(user.id);
				}
			}
		});

		socket.on("error", (error: Error) => {
			logger.error(`Socket error on ${socket.id}`, error);
		});
	});
};

function emitToSocket(connection: string, eventName: string, data: unknown) {
	const io = getIO();

	if (!io) return;

	io.to(connection).emit(eventName, data);
}

export { setIO, getIO, setupServerListeners, emitToSocket };
