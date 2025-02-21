"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Host, hostTable } from "@/lib/db/schema";
import { toggleClaim } from "./actions";

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
				<input
					onChange={async (e) => {
						try {
							await toggleClaim(e.target.checked, row.original.id);
						} catch (err) {
							console.log("cannot update host claimed state");
						}
					}}
					type="checkbox"
					defaultChecked={!!row.original.claimed}
				></input>
			);
		},
	},
];
