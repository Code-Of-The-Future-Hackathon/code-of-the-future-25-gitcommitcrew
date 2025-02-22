"use client";

import { MetricCard } from "./metric-card";
import { useState } from "react";
import { TimeInterval } from "@/types/monitoring";

export function CPUMetrics({ metrics }: { metrics: any }) {
	const [interval, setInterval] = useState<TimeInterval>("5m");

	return (
		<section id="cpu" className="space-y-6">
			<h2 className="text-2xl font-bold">CPU Metrics</h2>
			<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
				<MetricCard
					title="CPU Usage"
					data={metrics.usage}
					interval={interval}
					onIntervalChange={setInterval}
					unit="%"
					formatValue={(v) => `${v.toFixed(1)}%`}
				/>
				<MetricCard
					title="CPU Temperature"
					data={metrics.temperature}
					interval={interval}
					onIntervalChange={setInterval}
					unit="°C"
					formatValue={(v) => `${v.toFixed(1)}°C`}
				/>
				<MetricCard
					title="CPU Frequency"
					data={metrics.frequency}
					interval={interval}
					onIntervalChange={setInterval}
					unit="GHz"
					formatValue={(v) => `${(v / 1000).toFixed(2)} GHz`}
				/>
			</div>
		</section>
	);
}
