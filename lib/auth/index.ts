import { Session, sessionTable, User, userTable } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { sha256 } from "@oslojs/crypto/sha2";
import { encodeHexLowerCase } from "@oslojs/encoding";
import { db } from "../db";
import { cache } from "react";
import { cookies } from "next/headers";

const DAY_IN_MILLIS = 1000 * 60 * 60 * 24;

export async function createSession(
	token: string,
	userId: string
): Promise<Session> {
	const sessionId = encodeHexLowerCase(
		sha256(new TextEncoder().encode(token))
	);

	const session: Session = {
		id: sessionId,
		userId,
		expiresAt: new Date(Date.now() + DAY_IN_MILLIS * 30),
	};

	await db.insert(sessionTable).values(session);

	return session;
}

export async function validateSessionToken(
	token: string
): Promise<SessionValidationResult> {
	const sessionId = encodeHexLowerCase(
		sha256(new TextEncoder().encode(token))
	);

	const result = await db
		.select({ user: userTable, session: sessionTable })
		.from(sessionTable)
		.innerJoin(userTable, eq(userTable.id, sessionTable.userId))
		.where(eq(sessionTable.id, sessionId));

	if (result.length < 1) {
		return { session: null, user: null };
	}

	const { user, session } = result[0];
	if (Date.now() >= session.expiresAt.getTime()) {
		await db.delete(sessionTable).where(eq(sessionTable.id, session.id));
		return { session: null, user: null };
	}

	if (Date.now() >= session.expiresAt.getTime() + DAY_IN_MILLIS * 15) {
		session.expiresAt = new Date(Date.now() + DAY_IN_MILLIS * 30);
		await db
			.update(sessionTable)
			.set({ expiresAt: session.expiresAt })
			.where(eq(sessionTable.id, session.id));
	}

	return { session, user };
}

export async function invalidateSession(sessionId: string): Promise<void> {
	await db.delete(sessionTable).where(eq(sessionTable.id, sessionId));
}

export async function invalidateAllSessions(userId: string): Promise<void> {
	await db.delete(sessionTable).where(eq(sessionTable.userId, userId));
}

export const getCurrentSession = cache(
	async (): Promise<SessionValidationResult> => {
		const cookieStore = await cookies();

		const token = cookieStore.get("session")?.value ?? null;
		if (token === null) {
			return { session: null, user: null };
		}

		return await validateSessionToken(token);
	}
);

export type SessionValidationResult =
	| { session: Session; user: User }
	| { session: null; user: null };
