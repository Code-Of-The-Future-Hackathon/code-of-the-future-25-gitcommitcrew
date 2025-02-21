"use server";

import { db } from "@/lib/db";
import { hostTable } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function toggleClaim(claimed: boolean, id: string) {
	try {
		const host = (
			await db
				.update(hostTable)
				.set({ claimed })
				.where(eq(hostTable.id, id))
				.returning()
		)[0];
		console.log(
			`[LOG] updated host with id ${host.id} to be ${host.claimed ? "claimed" : "unclaimed"}`,
		);
	} catch (err) {
		console.log("[ERROR] cannot update host");
	}
}
