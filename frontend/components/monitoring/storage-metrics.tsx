"use client";

import { useEffect, useState } from "react";
import { formatBytes } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useSocket } from "@/app/hooks/useSocket";
import { api } from "@/lib/api";
import { TSystemData } from "../../../backend/src/services/system/models/systemData";

export function StorageMetrics({ hostId }: { hostId: string }) {
	const [historicData, setHistoricData] = useState<TSystemData[]>([]);
	const { changeRequestedData, isConnected, data: currentData } = useSocket();

	useEffect(() => {
		if (isConnected) {
			changeRequestedData(["disk"]);
		}
	}, [isConnected, changeRequestedData]);

	useEffect(() => {
		api
			.post("/system/host/history", {
				hostId,
				types: ["disk"],
			})
			.then(({ data }) => {
				if (data.success) {
					setHistoricData(data.data.disk);
				}
			});
	}, [hostId]);

	// Merge historic and current data properly
	const combinedData = [...historicData, ...currentData].filter(
		(entry) => entry?.data?.data?.diskLayout || entry?.data?.data?.fsSize,
	);

	// Show a fallback if no valid data is available
	if (combinedData.length === 0) {
		return (
			<section id="storage" className="space-y-6">
				<h2 className="text-2xl font-bold">Storage Devices</h2>
				<div>Loading...</div>
			</section>
		);
	}

	// Get latest storage data
	const latestData = combinedData[combinedData.length - 1];
	const fsSize = latestData?.data?.data?.fsSize ?? [];
	const diskLayout = latestData?.data?.data?.diskLayout ?? [];

	return (
		<section id="storage" className="space-y-6">
			<h2 className="text-2xl font-bold">Storage Devices</h2>
			<div className="grid grid-cols-1 gap-6">
				<Card>
					<CardHeader>
						<CardTitle>File Systems</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{fsSize.map((fs) => (
								<div key={`${fs.fs}-${fs.mount}`} className="space-y-2">
									<div className="flex items-center justify-between">
										<div>
											<span className="font-medium">{fs.mount}</span>
											<span className="text-muted-foreground ml-2 text-sm">
												({fs.type})
											</span>
										</div>
										<span className="text-muted-foreground text-sm">
											{formatBytes(fs.used)} / {formatBytes(fs.size)}
										</span>
									</div>
									<div className="bg-secondary h-2 overflow-hidden rounded-full">
										<div
											className={`h-full ${
												fs.use > 90
													? "bg-red-500"
													: fs.use > 70
														? "bg-yellow-500"
														: "bg-green-500"
											}`}
											style={{ width: `${fs.use}%` }}
										/>
									</div>
									<div className="text-muted-foreground text-xs">
										{fs.rw ? "Read/Write" : "Read Only"}
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Physical Disks</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{diskLayout.map((disk) => (
								<div
									key={`${disk.device}-${disk.serialNum}`}
									className="space-y-2"
								>
									<div className="flex items-center justify-between">
										<div>
											<span className="font-medium">{disk.name}</span>
											<span className="text-muted-foreground ml-2 text-sm">
												({disk.type})
											</span>
										</div>
										<span className="text-muted-foreground text-sm">
											{formatBytes(disk.size)}
										</span>
									</div>
									<div className="text-muted-foreground grid grid-cols-2 gap-2 text-sm">
										<div>Vendor: {disk.vendor}</div>
										<div>Interface: {disk.interfaceType}</div>
										{disk.temperature && (
											<div>Temperature: {disk.temperature}°C</div>
										)}
										<div>Status: {disk.smartStatus}</div>
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

export default StorageMetrics;
