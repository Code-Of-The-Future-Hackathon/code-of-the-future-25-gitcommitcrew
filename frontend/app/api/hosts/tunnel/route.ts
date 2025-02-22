import { db } from "@/lib/db";
import { hostTable } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
	const body = await request.json();
	const { hostId, tunnelPort, active } = body;

	try {
		const updatedHost = await db
			.update(hostTable)
			.set({
				tunnelPort,
				tunnelActive: active,
			})
			.where(eq(hostTable.id, hostId))
			.returning()
			.then((rows) => rows[0]);

		return NextResponse.json({ success: true, data: updatedHost });
	} catch (error) {
		console.error("Failed to update tunnel status:", error);
		return NextResponse.json(
			{ success: false, error: "Failed to update tunnel status" },
			{ status: 500 },
		);
	}
}

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const hostId = searchParams.get("hostId");

	if (!hostId) {
		return NextResponse.json(
			{ success: false, error: "Host ID is required" },
			{ status: 400 },
		);
	}

	try {
		const host = await db
			.select()
			.from(hostTable)
			.where(eq(hostTable.id, hostId))
			.then((rows) => rows[0]);

		return NextResponse.json({ success: true, data: host });
	} catch (error) {
		console.error("Failed to get host tunnel status:", error);
		return NextResponse.json(
			{ success: false, error: "Failed to get host tunnel status" },
			{ status: 500 },
		);
	}
}
