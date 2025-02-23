"use client";

import { CustomChart } from "./custom-chart";
import { useEffect, useState } from "react";
import { TimeInterval } from "@/types/monitoring";
import { useSocket } from "@/app/hooks/useSocket";

export function CPUMetrics({ metrics }: { metrics: any }) {
	const [interval, setInterval] = useState<TimeInterval>("5m");
	const { changeRequestedData, isConnected } = useSocket();

	useEffect(() => {
		changeRequestedData(["cpu", "process"]);
	}, [isConnected]);

	return (
		<section className="space-y-6">
			<h2 className="text-2xl font-bold">CPU Metrics</h2>
			<div className="grid grid-cols-1 gap-6">
				<CustomChart
					title="CPU Usage"
					data={metrics.usage}
					interval={interval}
					onIntervalChange={setInterval}
					formatValue={(v) => `${v.toFixed(1)}%`}
					unit="%"
					domain={[0, 100]}
					color="hsl(var(--chart-1))"
				/>
				<CustomChart
					title="CPU Temperature"
					data={metrics.temperature}
					interval={interval}
					onIntervalChange={setInterval}
					formatValue={(v) => `${v.toFixed(1)}°C`}
					unit="°C"
					domain={[20, 90]}
					color="hsl(var(--chart-2))"
				/>
				<CustomChart
					title="CPU Frequency"
					data={metrics.frequency}
					interval={interval}
					onIntervalChange={setInterval}
					formatValue={(v) => `${(v / 1000).toFixed(2)} GHz`}
					unit="GHz"
					color="hsl(var(--chart-3))"
				/>
			</div>
		</section>
	);
}
