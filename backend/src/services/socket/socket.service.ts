import { Server, Socket } from "socket.io";
import { and, desc, eq, gte, lte } from "drizzle-orm";

import logger from "@logger";
import { Data, EventData, events } from "../../../../events";
import {
	getHostByOrganizationIdAndHostId,
	getHostByPasswordHash,
	getUserOrganizationByUserId,
	getUsersFromOrganizationByPasswordHash,
} from "@services/system/system.service";
import { db } from "@config/db";
import { SystemData } from "@services/system/models";

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

		socket.on(events.HOST_NEW_DATA, async (data: EventData) => {
			const usersOrganization = await getUsersFromOrganizationByPasswordHash(
				data.passwordHash,
			);

			if (usersOrganization && usersOrganization.length > 0) {
				for (const { userId } of usersOrganization) {
					emitToUser(userId, events.HOST_NEW_DATA, data);
				}
			}

			const host = await getHostByPasswordHash(data.passwordHash);

			if (!host) {
				return;
			}

			await db
				.insert(SystemData)
				.values({ hostId: host.id, type: data.type, data });
		});

		socket.on(
			events.SERVER_GET_DATA_BY_TYPE,
			async (data: {
				type: Data;
				hostId: string;
				after: string;
				before: string;
			}) => {
				if (!user) {
					return;
				}

				const userOrganization = await getUserOrganizationByUserId(user.id);

				if (!userOrganization) {
					return;
				}

				const host = await getHostByOrganizationIdAndHostId(
					userOrganization.organizationId,
					data.hostId,
				);

				if (!host) {
					return;
				}

				const systemData = (
					await db
						.select()
						.from(SystemData)
						.where(
							and(
								eq(SystemData.hostId, data.hostId),
								eq(SystemData.type, data.type),
							),
						)
						.orderBy(desc(SystemData.createdAt))
				)[0];

				socket.emit(events.SERVER_GET_DATA_BY_TYPE, systemData);
			},
		);

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
		return;
	}

	for (const socketId of socketIds) {
		io?.to(socketId).emit(eventName, data);
	}
}

export { setIO, getIO, setupServerListeners, emitToUser };
