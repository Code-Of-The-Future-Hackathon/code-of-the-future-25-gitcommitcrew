"use server";

import { db } from "@/lib/db";
import { hostTable } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type FormState = {
	errors?: {
		password?: string[];
		claimd?: boolean[];
	};

	message?: string;
} | null;

export async function unclaimHost(id: string) {
	try {
		const updatedHost = (
			await db
				.update(hostTable)
				.set({ claimed: false })
				.where(eq(hostTable.id, id))
				.returning()
		)[0];
		console.log(
			`[LOG] updated host with id ${updatedHost.id} to be ${updatedHost.claimed ? "claimed" : "unclaimed"}`,
		);

		revalidatePath("/hosts");
		redirect("/hosts");
	} catch (err) {
		console.log("[ERROR] cannot update host", err);
	}
}

export async function claimHost(
	id: string,
	prevState: any,
	formData: FormData,
) {
	const inputData = {
		password: formData.get("password") as string,
	};

	let isCorrect = false;

	try {
		const host = (
			await db.select().from(hostTable).where(eq(hostTable.id, id))
		)[0];

		isCorrect = await Bun.password.verify(inputData.password, host.password);
	} catch (err) {
		console.log("[ERROR] cannot update host", err);
		return { invalidPassword: true };
	}

	if (isCorrect) {
		const updatedHost = (
			await db
				.update(hostTable)
				.set({ claimed: true })
				.where(eq(hostTable.id, id))
				.returning()
		)[0];
		console.log(
			`[LOG] updated host with id ${updatedHost.id} to be ${updatedHost.claimed ? "claimed" : "unclaimed"}`,
		);

		redirect("/");
	} else {
		console.log("[LOG] wrong cerdentials");
		return { invalidPassword: true };
	}
}
