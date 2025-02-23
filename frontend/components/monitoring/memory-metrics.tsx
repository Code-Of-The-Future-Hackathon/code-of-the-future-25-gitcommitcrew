"use client";

import { useEffect, useState } from "react";
import { formatBytes } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { CustomChart } from "./custom-chart";
import { useSocket } from "@/app/hooks/useSocket";
import { api } from "@/lib/api";
import { TSystemData } from "../../../backend/src/services/system/models/systemData";

export function MemoryMetrics({
	hostId,
	metrics,
}: {
	hostId: string;
	metrics: any;
}) {
	const [interval, setInterval] = useState<number>(3);
	const [historicData, setHistoricData] = useState<TSystemData[]>([]);
	const { changeRequestedData, isConnected, data: currentData } = useSocket();

	useEffect(() => {
		if (isConnected) {
			changeRequestedData(["memory"]);
		}
	}, [isConnected, changeRequestedData]);

	useEffect(() => {
		api
			.post("/system/host/history", {
				hostId,
				types: ["memory"],
			})
			.then(({ data }) => {
				if (data.success) {
					setHistoricData(data.data.memory);
				}
			});
	}, [hostId]);

	// Merge historic and current data properly
	const combinedData = [...historicData, ...currentData].filter(
		(entry) => entry?.data?.data?.mem,
	);

	// Show a fallback if no valid data is available
	if (combinedData.length === 0) {
		return (
			<section id="memory" className="space-y-6">
				<h2 className="text-2xl font-bold">Memory Usage</h2>
				<div>Loading...</div>
			</section>
		);
	}

	// Safely extract memory details
	const firstEntry = combinedData[0]?.data?.data?.mem ?? {
		available: 0,
		total: 1,
	};
	const { available, total } = firstEntry;

	const usedMemory = combinedData.map((inner) => ({
		timestamp: inner.createdAt,
		value: inner.data?.data?.mem?.available ?? 0,
	}));

	return (
		<section id="memory" className="space-y-6">
			<h2 className="text-2xl font-bold">Memory Usage</h2>
			<div className="grid grid-cols-1 gap-6">
				<CustomChart
					title="Memory Used"
					data={usedMemory}
					interval={interval}
					onIntervalChange={setInterval}
					formatValue={formatBytes}
					domain={[0, total]}
				/>
				<CustomChart
					title="Swap Usage"
					data={metrics.swap}
					interval={interval}
					onIntervalChange={setInterval}
					formatValue={formatBytes}
					domain={[0, 100000]}
				/>
				<Card>
					<CardHeader>
						<CardTitle>Memory Distribution</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="h-[60px]">
							<div className="bg-secondary h-4 w-full overflow-hidden rounded-full">
								<div
									className="bg-primary h-full"
									style={{
										width: `${(available / total) * 100}%`,
									}}
								/>
							</div>
							<div className="text-muted-foreground mt-2 flex justify-between text-sm">
								<span>Used: {formatBytes(available)}</span>
								<span>Total: {formatBytes(total)}</span>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</section>
	);
}
