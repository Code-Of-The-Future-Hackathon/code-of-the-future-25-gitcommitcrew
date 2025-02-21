"use client";

import { ColumnDef } from "@tanstack/react-table";
import { User } from "@/lib/db/schema";

export const columns: ColumnDef<User>[] = [
	{
		accessorKey: "username",
		header: "Username",
	},
	{
		accessorKey: "email",
		header: "Email",
	},
];
