import { getCurrentSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { sshSessionTable } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(
	request: Request,
	{ params }: { params: { id: string; sessionId: string } },
) {
	const { user } = await getCurrentSession();
	if (!user) {
		return new NextResponse(null, { status: 401 });
	}

	const session = await db
		.select()
		.from(sshSessionTable)
		.where(
			and(
				eq(sshSessionTable.id, params.sessionId),
				eq(sshSessionTable.userId, user.id),
			),
		)
		.then((res) => res[0]);

	if (!session || session.status !== "active") {
		return new NextResponse(null, { status: 404 });
	}

	return NextResponse.json({ status: "active" });
}

export async function DELETE(
	request: Request,
	{ params }: { params: { id: string; sessionId: string } },
) {
	const { user } = await getCurrentSession();
	if (!user) {
		return new NextResponse(null, { status: 401 });
	}

	await db
		.update(sshSessionTable)
		.set({
			status: "ended",
			endedAt: new Date(),
		})
		.where(
			and(
				eq(sshSessionTable.id, params.sessionId),
				eq(sshSessionTable.userId, user.id),
			),
		);

	return new NextResponse(null, { status: 200 });
}
