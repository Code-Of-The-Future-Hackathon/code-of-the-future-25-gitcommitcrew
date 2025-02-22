import { UserTable } from "@/components/user-table";

export default async function Page() {
	return (
		<div>
			<UserTable users={users} />
		</div>
	);
}
