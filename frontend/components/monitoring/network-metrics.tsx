"use client";

import { useEffect, useState } from "react";
import { formatBytes } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { CustomChart } from "./custom-chart";
import { useSocket } from "@/app/hooks/useSocket";
import { api } from "@/lib/api";
import { TSystemData } from "../../../backend/src/services/system/models/systemData";

export function NetworkMetrics({ hostId }: { hostId: string }) {
	const [intervalA, setIntervalA] = useState<number>(5);
	const [intervalB, setIntervalB] = useState<number>(5);
	const [historicData, setHistoricData] = useState<TSystemData[]>([]);
	const { changeRequestedData, isConnected, data: currentData } = useSocket();

	useEffect(() => {
		if (isConnected) {
			changeRequestedData(["network"]);
		}
	}, [isConnected, changeRequestedData]);

	useEffect(() => {
		api
			.post("/system/host/history", {
				hostId,
				types: ["network"],
			})
			.then(({ data }) => {
				if (data.success) {
					setHistoricData(data.data.network);
				}
			});
	}, [hostId]);

	// Merge historic and current data properly
	const combinedData = [...historicData, ...currentData].filter(
		(entry) => entry?.data?.data?.networkStats,
	);

	// Show a fallback if no valid data is available
	if (combinedData.length === 0) {
		return (
			<section id="network" className="space-y-6">
				<h2 className="text-2xl font-bold">Network Activity</h2>
				<div>Loading...</div>
			</section>
		);
	}

	// Get latest network stats
	const latestData = combinedData[combinedData.length - 1];
	const networkStats = latestData?.data?.data?.networkStats ?? [];

	// Transform time series data for each interface
	const getInterfaceData = (
		interfaceName: string,
		metric: "rx_sec" | "tx_sec",
	) => {
		return combinedData.map((entry) => {
			const interfaceData = entry.data?.data?.networkStats?.find(
				(stat) => stat.iface === interfaceName,
			);
			return {
				timestamp: entry.createdAt,
				value: interfaceData?.[metric] ?? 0,
			};
		});
	};

	return (
		<section id="network" className="space-y-6">
			<h2 className="text-2xl font-bold">Network Activity</h2>
			<div className="grid grid-cols-1 gap-6">
				{networkStats.map((iface) => (
					<Card key={iface.iface}>
						<CardHeader>
							<CardTitle>Interface: {iface.iface}</CardTitle>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="text-muted-foreground flex justify-between text-sm">
								<span>Status: {iface.operstate}</span>
								<span>Latency: {iface.ms}ms</span>
							</div>

							<CustomChart
								title="Received Data"
								data={getInterfaceData(iface.iface, "rx_sec")}
								interval={intervalA}
								onIntervalChange={setIntervalA}
								formatValue={(v) => `${formatBytes(v)}/s`}
							/>

							<CustomChart
								title="Transmitted Data"
								data={getInterfaceData(iface.iface, "tx_sec")}
								interval={intervalB}
								onIntervalChange={setIntervalB}
								formatValue={(v) => `${formatBytes(v)}/s`}
							/>

							<div className="text-muted-foreground grid grid-cols-2 gap-4 text-sm">
								<div>
									<div>Total Received: {formatBytes(iface.rx_bytes)}</div>
									<div>Dropped: {iface.rx_dropped}</div>
									<div>Errors: {iface.rx_errors}</div>
								</div>
								<div>
									<div>Total Transmitted: {formatBytes(iface.tx_bytes)}</div>
									<div>Dropped: {iface.tx_dropped}</div>
									<div>Errors: {iface.tx_errors}</div>
								</div>
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		</section>
	);
}

export default NetworkMetrics;
