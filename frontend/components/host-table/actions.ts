"use server";

import { getCurrentSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { hostTable, hostToUser } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
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
	const { user } = await getCurrentSession();

	if (!user) {
		redirect("/auth");
	}

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

		const removedRelation = await db
			.delete(hostToUser)
			.where(
				and(
					eq(hostToUser.userId, user.id),
					eq(hostToUser.hostId, updatedHost.id),
				),
			);

		console.log(
			`[LOG] removed relation with user ${user.id} and host ${updatedHost.id}}`,
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
	const { user } = await getCurrentSession();
	if (!user) {
		redirect("/auth");
	}
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

		const relation = await db
			.insert(hostToUser)
			.values({ userId: user.id, hostId: updatedHost.id });
		console.log(
			`[LOG] created relation from user ${user.id} to host ${updatedHost.id}`,
		);

		redirect("/");
	} else {
		console.log("[LOG] wrong cerdentials");
		return { invalidPassword: true };
	}
}
