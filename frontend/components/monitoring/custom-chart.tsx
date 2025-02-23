"use client";

import {
	ResponsiveContainer,
	LineChart,
	Line,
	XAxis,
	YAxis,
	Tooltip,
	CartesianGrid,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { formatSeconds, parseFormattedSeconds } from "./util";

interface CustomChartProps {
	title: string;
	data: { timestamp: number; value: number }[];
	interval: number;
	onIntervalChange: (interval: number) => void;
	formatValue?: (value: number) => string;
	unit?: string;
	domain?: [number, number];
	gridRows?: number;
	color?: string;
}

const intervals: number[] = [
	5, 10, 30, 60, 300, 900, 1800, 3600, 10800, 21600, 43200, 86400,
];

export function CustomChart({
	title,
	data: outerData,
	interval,
	onIntervalChange,
	formatValue = (v) => v.toString(),
	unit = "",
	domain,
	gridRows = 5,
	color = "hsl(var(--primary))",
}: CustomChartProps) {
	const data =
		interval == 1
			? outerData
			: outerData.filter((_, index) => (index + 1) % interval === 0);
	const values = data.map((d) => d.value);
	const defaultDomain: [number, number] = [
		Math.floor(Math.min(...values) * 0.9),
		Math.ceil(Math.max(...values) * 1.1),
	];

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-base font-medium">{title}</CardTitle>
				<Select
					value={formatSeconds(interval)}
					onValueChange={(value) =>
						onIntervalChange(parseFormattedSeconds(value))
					}
				>
					<SelectTrigger className="w-[100px]">
						<SelectValue placeholder="Interval" />
					</SelectTrigger>
					<SelectContent>
						{intervals.map((i) => (
							<SelectItem key={i} value={formatSeconds(i)}>
								{formatSeconds(i)}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</CardHeader>
			<CardContent>
				<div className="h-[300px] w-full">
					<ResponsiveContainer>
						<LineChart
							data={data}
							margin={{ top: 20, right: 10, left: 10, bottom: 20 }}
						>
							{/* Customized Grid */}
							<CartesianGrid
								strokeDasharray="3 3"
								vertical={false}
								stroke="hsl(var(--muted-foreground)/0.1)"
							/>

							{/* Customized XAxis */}
							<XAxis
								dataKey="timestamp"
								tickFormatter={(ts) => new Date(ts).toLocaleTimeString()}
								stroke="hsl(var(--muted-foreground))"
								fontSize={12}
								tickLine={false}
								axisLine={false}
								dy={10}
							/>

							{/* Customized YAxis */}
							<YAxis
								tickFormatter={formatValue}
								stroke="hsl(var(--muted-foreground))"
								fontSize={12}
								tickLine={false}
								axisLine={false}
								domain={domain || defaultDomain}
								ticks={Array.from(
									{ length: gridRows + 1 },
									(_, i) =>
										defaultDomain[0] +
										(i * (defaultDomain[1] - defaultDomain[0])) / gridRows,
								)}
								dx={-10}
							/>

							{/* Customized Tooltip */}
							<Tooltip
								content={({ active, payload, label }) => {
									if (!active || !payload?.length) return null;
									return (
										<div className="bg-background rounded-lg border p-3 shadow-sm">
											<div className="text-muted-foreground text-sm">
												{new Date(label).toLocaleString()}
											</div>
											<div className="text-sm font-medium">
												{formatValue(payload[0].value as number)} {unit}
											</div>
										</div>
									);
								}}
							/>

							{/* Customized Line */}
							<Line
								type="monotone"
								dataKey="value"
								stroke={color}
								strokeWidth={2}
								dot={false}
								activeDot={{
									r: 4,
									fill: color,
									stroke: "hsl(var(--background))",
									strokeWidth: 2,
								}}
								animationDuration={300}
							/>
						</LineChart>
					</ResponsiveContainer>
				</div>
			</CardContent>
		</Card>
	);
}
