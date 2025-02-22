"use client";

import { MetricCard } from "./metric-card";
import { useState } from "react";
import { TimeInterval } from "@/types/monitoring";
import { formatBytes } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { CustomChart } from "./custom-chart";

export function NetworkMetrics({ metrics }: { metrics: any }) {
	const [interval, setInterval] = useState<TimeInterval>("5m");

	return (
		<section id="network" className="space-y-6">
			<h2 className="text-2xl font-bold">Network Activity</h2>
			<div className="grid grid-cols-1 gap-6">
				<CustomChart
					title="Network In"
					data={metrics.rx_bytes}
					interval={interval}
					onIntervalChange={setInterval}
					formatValue={(v) => `${formatBytes(v)}/s`}
				/>
				<CustomChart
					title="Network Out"
					data={metrics.tx_bytes}
					interval={interval}
					onIntervalChange={setInterval}
					formatValue={(v) => `${formatBytes(v)}/s`}
				/>
				<CustomChart
					title="Active Connections"
					data={metrics.connections}
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
							{metrics.interfaces.map((iface: any) => (
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
