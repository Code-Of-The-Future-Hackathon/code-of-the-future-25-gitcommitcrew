"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "./view-options";
import { DataTableFacetedFilter } from "./filter";

interface DataTableToolbarProps<TData> {
	table: Table<TData>;
	filterKey?: string;
	filterPlaceholder?: string;
	filters?: {
		title: string;
		options: {
			label: string;
			value: string;
			icon?: React.ComponentType<{ className?: string }>;
		}[];
	}[];
}

export function DataTableToolbar<TData>({
	table,
	filterKey,
	filterPlaceholder,
	filters,
}: DataTableToolbarProps<TData>) {
	const isFiltered = table.getState().columnFilters.length > 0;

	return (
		<div className="flex items-center justify-between">
			<div className="flex flex-1 items-center space-x-2">
				{filterKey && (
					<Input
						placeholder={filterPlaceholder || "Search..."}
						value={
							(table.getColumn(filterKey)?.getFilterValue() as string) ?? ""
						}
						onChange={(event) =>
							table.getColumn(filterKey)?.setFilterValue(event.target.value)
						}
						className="h-8 w-[150px] lg:w-[250px]"
					/>
				)}
				{filters?.map(
					(filter) =>
						table.getColumn(filter.title) && (
							<DataTableFacetedFilter
								key={filter.title}
								column={table.getColumn(filter.title)}
								title={filter.title}
								options={filter.options}
							/>
						),
				)}
				{isFiltered && (
					<Button
						variant="ghost"
						onClick={() => table.resetColumnFilters()}
						className="h-8 px-2 lg:px-3"
					>
						Reset
						<Cross2Icon className="ml-2 h-4 w-4" />
					</Button>
				)}
			</div>
			<DataTableViewOptions table={table} />
		</div>
	);
}
