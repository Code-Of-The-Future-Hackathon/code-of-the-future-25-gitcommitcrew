import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TimeInterval } from "@/types/monitoring";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
} from "recharts";

interface MetricCardProps {
	title: string;
	data: { timestamp: number; value: number }[];
	interval: TimeInterval;
	onIntervalChange: (interval: TimeInterval) => void;
	unit?: string;
	formatValue?: (value: number) => string;
}

const intervals: TimeInterval[] = [
	"5s",
	"10s",
	"30s",
	"1m",
	"5m",
	"15m",
	"30m",
	"1h",
	"3h",
	"6h",
	"12h",
	"24h",
];

export function MetricCard({
	title,
	data,
	interval,
	onIntervalChange,
	unit = "",
	formatValue = (v) => v.toString(),
}: MetricCardProps) {
	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-base font-medium">{title}</CardTitle>
				<Select
					value={interval}
					onValueChange={(value) => onIntervalChange(value as TimeInterval)}
				>
					<SelectTrigger className="w-[100px]">
						<SelectValue placeholder="Interval" />
					</SelectTrigger>
					<SelectContent>
						{intervals.map((i) => (
							<SelectItem key={i} value={i}>
								{i}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</CardHeader>
			<CardContent>
				<div className="h-[200px]">
					<ResponsiveContainer width="100%" height="100%">
						<LineChart data={data}>
							<XAxis
								dataKey="timestamp"
								tickFormatter={(ts) => new Date(ts).toLocaleTimeString()}
							/>
							<YAxis tickFormatter={(value) => formatValue(value)} />
							<Tooltip
								labelFormatter={(ts) => new Date(ts).toLocaleString()}
								formatter={(value: number) => [formatValue(value), title]}
							/>
							<Line
								type="monotone"
								dataKey="value"
								stroke="#0ea5e9"
								dot={false}
							/>
						</LineChart>
					</ResponsiveContainer>
				</div>
			</CardContent>
		</Card>
	);
}
