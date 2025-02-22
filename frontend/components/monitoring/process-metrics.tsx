"use client";

import { useState } from "react";
import { TimeInterval } from "@/types/monitoring";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { CustomChart } from "./custom-chart";

export function ProcessMetrics({ metrics }: { metrics: any }) {
	const [interval, setInterval] = useState<TimeInterval>("5m");

	return (
		<section id="processes" className="space-y-6">
			<h2 className="text-2xl font-bold">Process Statistics</h2>
			<div className="grid grid-cols-1 gap-6">
				<CustomChart
					title="Total Processes"
					data={metrics.total}
					interval={interval}
					onIntervalChange={setInterval}
					formatValue={(v) => v.toString()}
				/>
				<CustomChart
					title="Running Processes"
					data={metrics.running}
					interval={interval}
					onIntervalChange={setInterval}
					formatValue={(v) => v.toString()}
				/>
				<CustomChart
					title="Blocked Processes"
					data={metrics.blocked}
					interval={interval}
					onIntervalChange={setInterval}
					formatValue={(v) => v.toString()}
				/>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Top Processes</CardTitle>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>PID</TableHead>
								<TableHead>Process</TableHead>
								<TableHead>CPU %</TableHead>
								<TableHead>Memory %</TableHead>
								<TableHead>State</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{metrics.topProcesses.map((process: any) => (
								<TableRow key={process.pid}>
									<TableCell>{process.pid}</TableCell>
									<TableCell>{process.name}</TableCell>
									<TableCell>{process.cpu.toFixed(1)}%</TableCell>
									<TableCell>{process.memory.toFixed(1)}%</TableCell>
									<TableCell>
										<span
											className={`rounded-full px-2 py-1 text-xs ${
												process.state === "running"
													? "bg-green-500/10 text-green-500"
													: "bg-yellow-500/10 text-yellow-500"
											}`}
										>
											{process.state}
										</span>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>
		</section>
	);
}
