import { User } from "@/lib/db/schema";
import { DataTable } from "../data-table";
import { columns } from "./columns";

interface UserTableProps {
	users: User[];
}

export function UserTable({ users }: UserTableProps) {
	return <DataTable columns={columns} data={users} />;
}
