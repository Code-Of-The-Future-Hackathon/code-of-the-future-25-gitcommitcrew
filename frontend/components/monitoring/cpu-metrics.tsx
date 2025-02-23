"use client";

import { useEffect, useState } from "react";
import { CustomChart } from "./custom-chart";
import { useSocket } from "@/app/hooks/useSocket";
import { api } from "@/lib/api";
import { TSystemData } from "../../../backend/src/services/system/models/systemData";

export function CPUMetrics({ hostId }: { hostId: string }) {
	const [intervalA, setIntervalA] = useState<number>(5);
	const [intervalB, setIntervalB] = useState<number>(5);
	const [intervalC, setIntervalC] = useState<number>(5);
	const [historicData, setHistoricData] = useState<TSystemData[]>([]);
	const { changeRequestedData, isConnected, data: currentData } = useSocket();

	useEffect(() => {
		if (isConnected) {
			changeRequestedData(["cpu"]);
		}
	}, [isConnected, changeRequestedData]);

	useEffect(() => {
		api
			.post("/system/host/history", {
				hostId,
				types: ["cpu"],
			})
			.then(({ data }) => {
				if (data.success) {
					setHistoricData(data.data.cpu);
				}
			});
	}, [hostId]);

	// Merge historic and current data properly
	const combinedData = [...historicData, ...currentData].filter(
		(entry) => entry?.data?.data,
	);

	console.log(combinedData[0]);

	// Show a fallback if no valid data is available
	if (combinedData.length === 0) {
		return (
			<section className="space-y-6">
				<h2 className="text-2xl font-bold">CPU Metrics</h2>
				<div>Loading...</div>
			</section>
		);
	}

	// Transform data for charts
	const cpuUsage = combinedData.map((inner) => ({
		timestamp: inner.createdAt,
		value:
			(inner.data.data.cpu?.speed / inner.data.data.cpu?.speedMax) * 100 ?? 0,
	}));

	const cpuTemperature = combinedData.map((inner) => ({
		timestamp: inner.createdAt,
		value: inner.data.data.cpuTemperature?.main ?? 0,
	}));

	const cpuFrequency = combinedData.map((inner) => ({
		timestamp: inner.createdAt,
		value: inner.data.data.cpuCurrentSpeed?.avg ?? 0,
	}));

	return (
		<section className="space-y-6">
			<h2 className="text-2xl font-bold">CPU Metrics</h2>
			<div className="grid grid-cols-1 gap-6">
				<CustomChart
					title="CPU Usage"
					data={cpuUsage}
					interval={intervalA}
					onIntervalChange={setIntervalA}
					formatValue={(v) => `${v.toFixed(1)}%`}
					unit="%"
					domain={[0, 100]}
					color="hsl(var(--chart-1))"
				/>
				<CustomChart
					title="CPU Temperature"
					data={cpuTemperature}
					interval={intervalB}
					onIntervalChange={setIntervalB}
					formatValue={(v) => `${v.toFixed(1)}°C`}
					unit="°C"
					domain={[20, 90]}
					color="hsl(var(--chart-2))"
				/>
				<CustomChart
					title="CPU Frequency"
					data={cpuFrequency}
					interval={intervalC}
					onIntervalChange={setIntervalC}
					formatValue={(v) => `${v.toFixed(2)} GHz`}
					unit="GHz"
					color="hsl(var(--chart-3))"
				/>
			</div>
		</section>
	);
}
