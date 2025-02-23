import { db } from "@config/db";
import {
	Host,
	NewHost,
	OrganizationHost,
	SystemData,
	TSystemData,
} from "./models";
import { AppError } from "@common/error/appError";
import { SystemErrors } from "./constants/errors";
import { and, eq, inArray, desc } from "drizzle-orm";
import { Organization, UserOrganization } from "@services/user/models";
import { Data } from "../../../../events";

const getUserOrganizationByUserId = async (userId: string) => {
	const userOrganization = (
		await db
			.select()
			.from(UserOrganization)
			.where(eq(UserOrganization.userId, userId))
	)[0];

	if (!userOrganization) {
		return;
	}

	return userOrganization;
};

const getOrganizationNameById = async (organizationId: string) => {
	const organization = (
		await db
			.select()
			.from(Organization)
			.where(eq(Organization.id, organizationId))
	)[0];

	if (!organization) {
		return;
	}

	return organization.name;
};

const getHostByPasswordHash = async (passwordHash: string) => {
	const host = (
		await db.select().from(Host).where(eq(Host.passwordHash, passwordHash))
	)[0];

	if (!host) {
		return;
	}

	return host;
};

const getHostByOrganizationIdAndHostId = async (
	organizationId: string,
	hostId: string,
) => {
	const host = (
		await db
			.select({
				id: Host.id,
				ip: Host.ip,
				claimed: Host.claimed,
				passwordHash: Host.passwordHash,
				mac: Host.mac,
				hostname: Host.hostname,
				port: Host.port,
				org: Host.org,
			})
			.from(Host)
			.leftJoin(
				OrganizationHost,
				and(
					eq(OrganizationHost.hostId, Host.id),
					eq(OrganizationHost.organizationId, organizationId),
				),
			)
			.where(eq(Host.id, hostId))
	)[0];

	if (!host) {
		return;
	}

	return host;
};

const getUsersFromOrganizationByPasswordHash = async (passwordHash: string) => {
	const host = await getHostByPasswordHash(passwordHash);

	if (!host) {
		return;
	}

	const organizationHost = (
		await db
			.select()
			.from(OrganizationHost)
			.where(eq(OrganizationHost.hostId, host.id))
	)[0];

	if (!organizationHost) {
		return;
	}

	const userOrganizations = await db
		.select()
		.from(UserOrganization)
		.where(
			eq(UserOrganization.organizationId, organizationHost.organizationId),
		);

	return userOrganizations;
};

const getHosts = async (userId: string, claimed: boolean) => {
	const userOrganization = await getUserOrganizationByUserId(userId);

	if (!userOrganization) {
		throw new AppError(SystemErrors.NOT_FOUND);
	}

	const hosts = await db
		.select({
			id: Host.id,
			ip: Host.ip,
			claimed: Host.claimed,
			passwordHash: Host.passwordHash,
			mac: Host.mac,
			hostname: Host.hostname,
			port: Host.port,
			org: Host.org,
		})
		.from(Host)
		.leftJoin(
			OrganizationHost,
			and(
				eq(OrganizationHost.hostId, Host.id),
				eq(OrganizationHost.organizationId, userOrganization.organizationId),
			),
		)
		.where(eq(Host.claimed, claimed));

	return hosts;
};

const addNewHost = async (newHost: NewHost) => {
	const createdHost = (await db.insert(Host).values(newHost).returning())[0];

	if (!createdHost) {
		throw new AppError(SystemErrors.COULD_NOT_CREATE);
	}

	return createdHost;
};

const claimHost = async (userId: string, password: string, hostId: string) => {
	const userOrganization = await getUserOrganizationByUserId(userId);

	if (!userOrganization) {
		throw new AppError(SystemErrors.NOT_FOUND);
	}

	const host = (await db.select().from(Host).where(eq(Host.id, hostId)))[0];

	if (!host) {
		throw new AppError(SystemErrors.NOT_FOUND);
	}

	if (host.claimed) {
		throw new AppError(SystemErrors.INVALID_DATA);
	}

	if (!(await Bun.password.verify(password, host.passwordHash))) {
		throw new AppError(SystemErrors.INVALID_DATA);
	}

	await db.update(Host).set({ claimed: true }).where(eq(Host.id, hostId));

	await db
		.insert(OrganizationHost)
		.values({ organizationId: userOrganization.organizationId, hostId });

	return true;
};

const getLatestData = async (userId: string, hostId: string, types: Data[]) => {
	const userOrganization = await getUserOrganizationByUserId(userId);

	if (!userOrganization) {
		throw new AppError(SystemErrors.NOT_FOUND);
	}

	const host = await getHostByOrganizationIdAndHostId(
		userOrganization.organizationId,
		hostId,
	);

	if (!host) {
		throw new AppError(SystemErrors.NOT_FOUND);
	}

	const systemData = await db
		.selectDistinctOn([SystemData.type])
		.from(SystemData)
		.where(and(eq(SystemData.hostId, hostId), inArray(SystemData.type, types)))
		.orderBy(SystemData.type, desc(SystemData.createdAt));

	if (!systemData) {
		throw new AppError(SystemErrors.NOT_FOUND);
	}

	return systemData;
};

const getSystemData = async (userId: string, hostId: string) => {
	const userOrganization = await getUserOrganizationByUserId(userId);

	if (!userOrganization) {
		throw new AppError(SystemErrors.NOT_FOUND);
	}

	const host = await getHostByOrganizationIdAndHostId(
		userOrganization.organizationId,
		hostId,
	);

	if (!host) {
		throw new AppError(SystemErrors.NOT_FOUND);
	}

	const system = (
		await db
			.select()
			.from(SystemData)
			.where(and(eq(SystemData.hostId, hostId), eq(SystemData.type, "system")))
			.orderBy(desc(SystemData.createdAt))
			.limit(1)
	)[0];

	if (!system) {
		throw new AppError(SystemErrors.NOT_FOUND);
	}

	const cpu = (
		await db
			.select()
			.from(SystemData)
			.where(and(eq(SystemData.hostId, hostId), eq(SystemData.type, "cpu")))
			.orderBy(desc(SystemData.createdAt))
			.limit(1)
	)[0];

	if (!cpu) {
		throw new AppError(SystemErrors.NOT_FOUND);
	}

	const disk = (
		await db
			.select()
			.from(SystemData)
			.where(and(eq(SystemData.hostId, hostId), eq(SystemData.type, "disk")))
			.orderBy(desc(SystemData.createdAt))
			.limit(1)
	)[0];

	if (!disk) {
		throw new AppError(SystemErrors.NOT_FOUND);
	}

	return { system, cpu, disk };
};

const getHistoryData = async (
	userId: string,
	hostId: string,
	types: Data[],
) => {
	const userOrganization = await getUserOrganizationByUserId(userId);

	if (!userOrganization) {
		throw new AppError(SystemErrors.NOT_FOUND);
	}

	const host = await getHostByOrganizationIdAndHostId(
		userOrganization.organizationId,
		hostId,
	);

	if (!host) {
		throw new AppError(SystemErrors.NOT_FOUND);
	}

	const systemData = await db
		.select()
		.from(SystemData)
		.where(and(eq(SystemData.hostId, hostId), inArray(SystemData.type, types)))
		.orderBy(SystemData.type, desc(SystemData.createdAt))
		.limit(500);

	if (!systemData) {
		throw new AppError(SystemErrors.NOT_FOUND);
	}

	const mappedData: Record<string, TSystemData[]> = {};

	for (const data of systemData.reverse()) {
		if (!mappedData[data.type]) {
			mappedData[data.type] = [];
		}

		mappedData[data.type]?.push(data);
	}

	return mappedData;
};

export {
	getUserOrganizationByUserId,
	getHostByOrganizationIdAndHostId,
	getHosts,
	addNewHost,
	claimHost,
	getUsersFromOrganizationByPasswordHash,
	getHostByPasswordHash,
	getOrganizationNameById,
	getLatestData,
	getSystemData,
	getHistoryData,
};
