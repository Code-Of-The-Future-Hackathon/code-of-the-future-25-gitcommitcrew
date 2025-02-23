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
				}
			});
	}, [hostId]);

	// Merge historic and current data properly
	const combinedData = [...historicData, ...currentData].filter(
		(entry) => entry?.data?.data?.currentLoad,
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
	const loadData = combinedData.map((inner) => ({
		timestamp: inner.createdAt,
		value: inner.data?.data?.currentLoad?.currentLoad ?? 0,
	}));

	const userLoadData = combinedData.map((inner) => ({
		timestamp: inner.createdAt,
		value: inner.data?.data?.currentLoad?.currentLoadUser ?? 0,
	}));

	const systemLoadData = combinedData.map((inner) => ({
		timestamp: inner.createdAt,
		value: inner.data?.data?.currentLoad?.currentLoadSystem ?? 0,
	}));

	// Get latest load data
	const latestData =
		combinedData[combinedData.length - 1]?.data?.data?.currentLoad;
	const cpuCores = latestData?.cpus ?? [];

	return (
		<section id="processes" className="space-y-6">
			<h2 className="text-2xl font-bold">CPU Load Statistics</h2>
			<div className="grid grid-cols-1 gap-6">
				<CustomChart
					title="Total CPU Load"
					data={loadData}
					interval={interval}
					onIntervalChange={setInterval}
					formatValue={(v) => `${v.toFixed(1)}%`}
					domain={[0, 100]}
				/>
				<CustomChart
					title="User CPU Load"
					data={userLoadData}
					interval={interval}
					onIntervalChange={setInterval}
					formatValue={(v) => `${v.toFixed(1)}%`}
					domain={[0, 100]}
				/>
				<CustomChart
					title="System CPU Load"
					data={systemLoadData}
					interval={interval}
					onIntervalChange={setInterval}
					formatValue={(v) => `${v.toFixed(1)}%`}
					domain={[0, 100]}
				/>
			</div>
			<Card>
				<CardHeader>
					<CardTitle>CPU Cores Load</CardTitle>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Core</TableHead>
								<TableHead>Load %</TableHead>
								<TableHead>User %</TableHead>
								<TableHead>System %</TableHead>
								<TableHead>Nice %</TableHead>
								<TableHead>Idle %</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{cpuCores.map((core, index) => (
								<TableRow key={index}>
									<TableCell>Core {index + 1}</TableCell>
									<TableCell>{core.load.toFixed(1)}%</TableCell>
									<TableCell>{core.loadUser.toFixed(1)}%</TableCell>
									<TableCell>{core.loadSystem.toFixed(1)}%</TableCell>
									<TableCell>{core.loadNice.toFixed(1)}%</TableCell>
									<TableCell>{core.loadIdle.toFixed(1)}%</TableCell>
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
