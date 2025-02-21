import { HostTable } from "@/components/host-table";
import { getCurrentSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { hostTable } from "@/lib/db/schema";
import { redirect } from "next/navigation";

export default async function Page() {
	const { user } = await getCurrentSession();
	if (!user) redirect("/");

	// const authorized = await hasPerms(user, ["read:*", "write:*"]);
	// if (!authorized) redirect("/");

	const hosts = await db.select().from(hostTable);

	return (
		<div>
			<HostTable hosts={hosts} />
		</div>
	);
}
