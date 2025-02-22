import { db } from "@/lib/db";
import { hostTable } from "@/lib/db/schema";
import { NextRequest, NextResponse } from "next/server";

import z from "zod";

const hostSchema = z.object({
	ip: z.string().ip(),
	password: z.string(),
	mac: z.string(),
	hostname: z.string().min(1),
	org: z.string().min(1),
	port: z.number(),
});

export async function POST(req: NextRequest) {
	console.log("[LOG] getting request", req);
	const body = await req.formData();

	const inputData = {
		mac: body.get("mac") as string,
		password: body.get("password") as string,
		ip: body.get("ip") as string,
		hostname: body.get("hostname") as string,
		org: body.get("org") as string,
		port: parseInt(body.get("port") as string),
	};

	const { success, data } = hostSchema.safeParse(inputData);

	if (!success) {
		console.log("[ERROR] invalid data for host.");
		console.log(inputData);
		return new NextResponse(null, { status: 500 });
	}

	try {
		const newHost = (await db.insert(hostTable).values(data).returning())[0];
		console.log("[LOG] created host with id ", newHost.id);

		return NextResponse.json({ success: true, data: newHost });
	} catch (e) {
		console.log("[ERROR] failed to create host", e);
		return NextResponse.json(
			{
				success: false,
				error: {
					message_error: "Failed to create host",
				},
			},
			{ status: 500 },
		);
	}
}
