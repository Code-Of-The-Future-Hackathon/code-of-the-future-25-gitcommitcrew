import { db } from "@/lib/db";
import { hostTable } from "@/lib/db/schema";
import { NextRequest, NextResponse } from "next/server";

import z from "zod";

const hostSchema = z.object({
	ip: z.string().ip(),
	password: z.string(),
	mac: z.string().length(17),
	hostname: z.string().min(1),
});

export async function POST(req: NextRequest) {
	const body = await req.formData();

	const inputData = {
		mac: body.get("mac") as string,
		password: body.get("password") as string,
		ip: body.get("ip") as string,
		hostname: body.get("hostname") as string,
	};

	const { success, data } = hostSchema.safeParse(inputData);

	if (!success) {
		console.log("[ERROR] invalid data for host.");
		return new NextResponse(null, { status: 500 });
	}

	const newHost = await db.insert(hostTable).values(data);
}
