"use server";

import { UnclaimedHost } from "@/components/dashboard/add-device-button";
import { db } from "@/lib/db";
import { hostTable, userHostTable } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function claimHost(
	userId: string,
	password: string,
	unclaimedHost: UnclaimedHost,
) {
	const host = await db
		.select()
		.from(hostTable)
		.where(eq(hostTable.id, unclaimedHost.id))
		.then((res) => res[0]);

	const isValid = await Bun.password.verify(password, host.password);

	if (!isValid) {
		return {
			error: "Wrong password",
		};
	}

	await db
		.update(hostTable)
		.set({ claimed: true })
		.where(eq(hostTable.id, host.id));

	await db.insert(userHostTable).values({
		userId: userId,
		hostId: host.id,
	});
}
