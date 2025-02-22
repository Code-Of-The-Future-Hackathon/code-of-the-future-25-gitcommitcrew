import { getCurrentSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { sshSessionTable, hostTable } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { redis } from "@/lib/redis";

export async function POST(
	request: Request,
	{ params }: { params: { id: string } },
) {
	const { user } = await getCurrentSession();
	if (!user) {
		return new NextResponse(null, { status: 401 });
	}

	const host = await db
		.select()
		.from(hostTable)
		.where(eq(hostTable.id, params.id))
		.then((res) => res[0]);

	if (!host || !host.tunnelActive || !host.tunnelPort) {
		return NextResponse.json(
			{
				error: "Host is not available for SSH connection",
			},
			{ status: 400 },
		);
	}

	// Create new SSH session
	const session = await db
		.insert(sshSessionTable)
		.values({
			hostId: host.id,
			userId: user.id,
			status: "active",
			tunnelPort: host.tunnelPort,
			startedAt: new Date(),
		})
		.returning()
		.then((rows) => rows[0]);

	// Generate temporary access token
	const accessToken = randomUUID();

	// Store token in Redis with short expiration
	await redis.set(
		`ssh:${accessToken}`,
		JSON.stringify({
			sessionId: session.id,
			hostId: host.id,
			userId: user.id,
		}),
	);

	return NextResponse.json({
		jumpServer: process.env.JUMP_SERVER_HOST,
		port: host.tunnelPort,
		accessToken,
		sessionId: session.id,
	});
}
