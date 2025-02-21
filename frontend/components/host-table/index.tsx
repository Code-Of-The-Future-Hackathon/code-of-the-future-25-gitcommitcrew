import { Host } from "@/lib/db/schema";
import { DataTable } from "../data-table";
import { columns } from "./columns";

interface HostTableProps {
	hosts: Host[];
}

export function HostTable({ hosts }: HostTableProps) {
	return <DataTable columns={columns} data={hosts} />;
}
