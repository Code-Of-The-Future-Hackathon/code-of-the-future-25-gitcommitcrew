"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Host } from "@/lib/db/schema";

export const columns: ColumnDef<Host>[] = [
	{
		accessorKey: "ip",
		header: "IP",
	},
	{
		accessorKey: "hostname",
		header: "Hostname",
	},
	{
		accessorKey: "mac",
		header: "MAC address",
	},
	{
		header: "Claimed",
		accessorKey: "claimed",
		cell: ({ row }) => {
			return (
				<input type="checkbox" defaultChecked={!!row.original.claimed}></input>
			);
		},
	},
];
