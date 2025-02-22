"use client";

import { MetricCard } from "./metric-card";
import { useState } from "react";
import { TimeInterval } from "@/types/monitoring";
import { formatBytes } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { CustomChart } from "./custom-chart";

export function StorageMetrics({ metrics }: { metrics: any }) {
	const [interval, setInterval] = useState<TimeInterval>("5m");

	return (
		<section id="storage" className="space-y-6">
			<h2 className="text-2xl font-bold">Storage Performance</h2>
			<div className="grid grid-cols-1 gap-6">
				<CustomChart
					title="Read Throughput"
					data={metrics.read_bytes}
					interval={interval}
					onIntervalChange={setInterval}
					formatValue={(v) => `${formatBytes(v)}/s`}
				/>
				<CustomChart
					title="Write Throughput"
					data={metrics.write_bytes}
					interval={interval}
					onIntervalChange={setInterval}
					formatValue={(v) => `${formatBytes(v)}/s`}
				/>
				<CustomChart
					title="IOPS"
					data={metrics.iops}
					interval={interval}
					onIntervalChange={setInterval}
					formatValue={(v) => v.toFixed(0)}
				/>
				<Card>
					<CardHeader>
						<CardTitle>Storage Devices</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{metrics.devices.map((device: any) => (
								<div key={device.mount} className="space-y-2">
									<div className="flex items-center justify-between">
										<span className="font-medium">{device.mount}</span>
										<span className="text-muted-foreground text-sm">
											{formatBytes(device.used)} / {formatBytes(device.size)}
										</span>
									</div>
									<div className="bg-secondary h-2 overflow-hidden rounded-full">
										<div
											className={`h-full ${
												device.used / device.size > 0.9
													? "bg-red-500"
													: device.used / device.size > 0.7
														? "bg-yellow-500"
														: "bg-green-500"
											}`}
											style={{ width: `${(device.used / device.size) * 100}%` }}
										/>
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
