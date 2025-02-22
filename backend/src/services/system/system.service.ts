import { db } from "@config/db";
import { Host, NewHost, OrganizationHost } from "./models";
import { AppError } from "@common/error/appError";
import { SystemErrors } from "./constants/errors";
import { and, eq } from "drizzle-orm";
import { UserOrganization } from "@services/user/models";

const getUserOrganizationByUserId = async (userId: string) => {
	const userOrganization = (
		await db
			.select()
			.from(UserOrganization)
			.where(eq(UserOrganization.userId, userId))
	)[0];

	if (!userOrganization) {
		throw new AppError(SystemErrors.NOT_FOUND);
	}

	return userOrganization;
};

const getHosts = async (userId: string, claimed: boolean) => {
	const userOrganization = await getUserOrganizationByUserId(userId);

	const hosts = await db
		.select()
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

export { getHosts, addNewHost, claimHost };
