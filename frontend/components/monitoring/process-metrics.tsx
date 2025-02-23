"use client";

import { useEffect, useState } from "react";
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
import { useSocket } from "@/app/hooks/useSocket";
import { api } from "@/lib/api";
import { TSystemData } from "../../../backend/src/services/system/models/systemData";

export function ProcessMetrics({ hostId }: { hostId: string }) {
	const [interval, setInterval] = useState<number>(3);
	const [historicData, setHistoricData] = useState<TSystemData[]>([]);
	const { changeRequestedData, isConnected, data: currentData } = useSocket();

	useEffect(() => {
		if (isConnected) {
			changeRequestedData(["process"]);
		}
	}, [isConnected, changeRequestedData]);

	useEffect(() => {
		api
			.post("/system/host/history", {
				hostId,
				types: ["process"],
			})
			.then(({ data }) => {
				if (data.success) {
					setHistoricData(data.data.process);
					console.log(data.data.process);
				}
			});
	}, [hostId]);

	// Merge historic and current data properly
	const combinedData = [...historicData, ...currentData].filter(
		(entry) => entry?.data?.data?.process,
	);

	// Show a fallback if no valid data is available
	if (combinedData.length === 0) {
		return (
			<section id="processes" className="space-y-6">
				<h2 className="text-2xl font-bold">Process Statistics</h2>
				<div>Loading...</div>
			</section>
		);
	}

	// Transform data for charts
	const totalProcesses = combinedData.map((inner) => ({
		timestamp: inner.createdAt,
		value: inner.data?.data?.process?.total ?? 0,
	}));

	const runningProcesses = combinedData.map((inner) => ({
		timestamp: inner.createdAt,
		value: inner.data?.data?.process?.running ?? 0,
	}));

	const blockedProcesses = combinedData.map((inner) => ({
		timestamp: inner.createdAt,
		value: inner.data?.data?.process?.blocked ?? 0,
	}));

	// Get latest top processes
	const latestData = combinedData[combinedData.length - 1];
	const topProcesses = latestData?.data?.data?.process?.topProcesses ?? [];

	return (
		<section id="processes" className="space-y-6">
			<h2 className="text-2xl font-bold">Process Statistics</h2>
			<div className="grid grid-cols-1 gap-6">
				<CustomChart
					title="Total Processes"
					data={totalProcesses}
					interval={interval}
					onIntervalChange={setInterval}
					formatValue={(v) => v.toString()}
				/>
				<CustomChart
					title="Running Processes"
					data={runningProcesses}
					interval={interval}
					onIntervalChange={setInterval}
					formatValue={(v) => v.toString()}
				/>
				<CustomChart
					title="Blocked Processes"
					data={blockedProcesses}
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
							{topProcesses.map((process: any) => (
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

export default ProcessMetrics;
