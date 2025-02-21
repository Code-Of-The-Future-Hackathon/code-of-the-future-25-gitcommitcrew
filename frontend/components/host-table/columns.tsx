"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Host, hostTable } from "@/lib/db/schema";
import { toggleClaim } from "./actions";
import { Button } from "../ui/button";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

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
			return row.original.claimed ? (
				<Button className="text-white">Unclaim</Button>
			) : (
				<Dialog>
					<DialogTrigger>Open</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Are you absolutely sure?</DialogTitle>
							<DialogDescription>
								This action cannot be undone. This will permanently delete your
								account and remove your data from our servers.
							</DialogDescription>
						</DialogHeader>
					</DialogContent>
				</Dialog>
			);
		},
	},
];
