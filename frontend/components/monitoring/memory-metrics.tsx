"use client";

import { useEffect, useState } from "react";
import { formatBytes } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { CustomChart } from "./custom-chart";
import { useSocket } from "@/app/hooks/useSocket";

export function MemoryMetrics({ metrics }: { metrics: any }) {
	const [interval, setInterval] = useState<number>(3);
	const { changeRequestedData, isConnected, data } = useSocket();

	useEffect(() => {
		if (isConnected) {
			changeRequestedData(["memory"]);
		}
	}, [isConnected, changeRequestedData]);

	// Show a fallback if no data is available
	if (!data.length) {
		return (
			<section id="memory" className="space-y-6">
				<h2 className="text-2xl font-bold">Memory Usage</h2>
				<div>Loading...</div>
			</section>
		);
	}

	// Destructure memory details from the first data point
	const { available, total } = data[0].data.data.mem;

	const usedMemory = data.map((inner) => ({
		timestamp: inner.timestamp.getTime(),
		value: inner.data.data.mem.available,
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
