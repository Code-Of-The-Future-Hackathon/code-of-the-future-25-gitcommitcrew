"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Host, hostTable } from "@/lib/db/schema";
import { claimHost, unclaimHost } from "./actions";
import { Button } from "../ui/button";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { act, useActionState } from "react";

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
			const [state, action, pending] = useActionState(
				claimHost.bind(null, row.original.id),
				null,
			);

			console.log(state);
			return row.original.claimed ? (
				<Button
					onClick={async () => {
						await unclaimHost(row.original.id);
					}}
					className="text-white"
				>
					Unclaim
				</Button>
			) : (
				<Dialog>
					<DialogTrigger asChild>
						<Button variant="outline">Claim</Button>
					</DialogTrigger>
					<DialogContent className="sm:max-w-[425px]">
						<DialogHeader>
							<DialogTitle>Claim host {row.original.hostname}</DialogTitle>
							<DialogDescription>This action is revertable.</DialogDescription>
						</DialogHeader>
						<form action={action}>
							<div className="grid gap-4 py-4">
								<div className="grid grid-cols-4 items-center gap-4">
									<Label htmlFor="password" className="text-right">
										Password
									</Label>
									<Input name="password" id="password" className="col-span-3" />
								</div>
								{state?.invalidPassword && <p>Invalid Password.</p>}
							</div>
							<DialogFooter>
								<Button disabled={pending} type="submit">
									Claim host
								</Button>
							</DialogFooter>
						</form>
					</DialogContent>
				</Dialog>
			);
		},
	},
];
