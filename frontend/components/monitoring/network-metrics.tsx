"use client";

import { useEffect, useState } from "react";
import { formatBytes } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { CustomChart } from "./custom-chart";
import { useSocket } from "@/app/hooks/useSocket";
import { api } from "@/lib/api";
import { TSystemData } from "../../../backend/src/services/system/models/systemData";

export function NetworkMetrics({ hostId }: { hostId: string }) {
	const [interval, setInterval] = useState<number>(3);
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
		(entry) => entry?.data?.data?.network,
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

	// Transform data for charts
	const networkIn = combinedData.map((inner) => ({
		timestamp: inner.createdAt,
		value: inner.data?.data?.network?.rx_bytes ?? 0,
	}));

	const networkOut = combinedData.map((inner) => ({
		timestamp: inner.createdAt,
		value: inner.data?.data?.network?.tx_bytes ?? 0,
	}));

	const connections = combinedData.map((inner) => ({
		timestamp: inner.createdAt,
		value: inner.data?.data?.network?.connections?.length ?? 0,
	}));

	// Get latest network interfaces
	const latestData = combinedData[combinedData.length - 1];
	const interfaces = latestData?.data?.data?.network?.interfaces ?? [];

	return (
		<section id="network" className="space-y-6">
			<h2 className="text-2xl font-bold">Network Activity</h2>
			<div className="grid grid-cols-1 gap-6">
				<CustomChart
					title="Network In"
					data={networkIn}
					interval={interval}
					onIntervalChange={setInterval}
					formatValue={(v) => `${formatBytes(v)}/s`}
				/>
				<CustomChart
					title="Network Out"
					data={networkOut}
					interval={interval}
					onIntervalChange={setInterval}
					formatValue={(v) => `${formatBytes(v)}/s`}
				/>
				<CustomChart
					title="Active Connections"
					data={connections}
					interval={interval}
					onIntervalChange={setInterval}
					formatValue={(v) => v.toString()}
				/>
				<Card>
					<CardHeader>
						<CardTitle>Network Interfaces</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{interfaces.map((iface: any) => (
								<div key={iface.name} className="space-y-2">
									<div className="flex justify-between">
										<span className="font-medium">{iface.name}</span>
										<span
											className={
												iface.status === "up"
													? "text-green-500"
													: "text-red-500"
											}
										>
											{iface.status}
										</span>
									</div>
									<div className="text-muted-foreground text-sm">
										<div>MAC: {iface.mac}</div>
										<div>IPv4: {iface.ipv4}</div>
										<div>IPv6: {iface.ipv6}</div>
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			</div>
		</section>
	);
}

export default NetworkMetrics;
