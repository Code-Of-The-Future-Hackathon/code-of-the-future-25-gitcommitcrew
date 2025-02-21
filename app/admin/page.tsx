import { UserTable } from "@/components/user-table";
import { getCurrentSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { userTable } from "@/lib/db/schema";
import { hasPerms } from "@/lib/perms";
import { redirect } from "next/navigation";

export default async function Page() {
	const { user } = await getCurrentSession();
	if (!user) redirect("/");

	const authorized = await hasPerms(user, ["read:*", "write:*"]);
	if (!authorized) redirect("/");

	const users = await db.select().from(userTable);

	return (
		<div>
			<UserTable users={users} />
		</div>
	);
}
