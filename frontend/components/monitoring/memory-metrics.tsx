"use client";

import { MetricCard } from "./metric-card";
import { useState } from "react";
import { TimeInterval } from "@/types/monitoring";
import { formatBytes } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export function MemoryMetrics({ metrics }: { metrics: any }) {
	const [interval, setInterval] = useState<TimeInterval>("5m");

	return (
		<section id="memory" className="space-y-6">
			<h2 className="text-2xl font-bold">Memory Usage</h2>
			<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
				<MetricCard
					title="Memory Used"
					data={metrics.used}
					interval={interval}
					onIntervalChange={setInterval}
					formatValue={(v) => formatBytes(v)}
				/>
				<MetricCard
					title="Swap Usage"
					data={metrics.swap}
					interval={interval}
					onIntervalChange={setInterval}
					formatValue={(v) => formatBytes(v)}
				/>
				<div className="md:col-span-2">
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
											width: `${(metrics.used[metrics.used.length - 1].value / metrics.total) * 100}%`,
										}}
									/>
								</div>
								<div className="text-muted-foreground mt-2 flex justify-between text-sm">
									<span>
										Used:{" "}
										{formatBytes(metrics.used[metrics.used.length - 1].value)}
									</span>
									<span>Total: {formatBytes(metrics.total)}</span>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</section>
	);
}
