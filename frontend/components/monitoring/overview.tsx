"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Terminal, AlertCircle, Clock, ArrowUpRight } from "lucide-react";
import { SystemInfo, SystemMetrics } from "@/types/monitoring";
import { formatBytes } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { SSHConnect } from "./ssh-connect";

interface OverviewProps {
	systemInfo: SystemInfo;
	metrics: SystemMetrics;
	deviceId: string;
}

export function Overview({ systemInfo, metrics, deviceId }: OverviewProps) {
	// Get the latest values from metrics
	const latestCpuUsage = metrics.cpu.usage[metrics.cpu.usage.length - 1].value;
	const latestMemoryUsage =
		metrics.memory.used[metrics.memory.used.length - 1].value;
	const latestNetworkIn =
		metrics.network.rx_bytes[metrics.network.rx_bytes.length - 1].value;
	const latestNetworkOut =
		metrics.network.tx_bytes[metrics.network.tx_bytes.length - 1].value;

	const alerts = [
		{
			id: 1,
			severity: "warning",
			message: "High CPU temperature",
			time: "2m ago",
		},
		{
			id: 2,
			severity: "info",
			message: "System update available",
			time: "1h ago",
		},
	];

	return (
		<section id="overview" className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-2xl font-bold">System Overview</h2>
					<p className="text-muted-foreground">
						Last updated: {new Date().toLocaleTimeString()}
					</p>
				</div>
				<SSHConnect deviceId={deviceId} deviceName={systemInfo.hostname} />
			</div>

			{/* Quick Stats */}
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
				<QuickStat
					title="System Uptime"
					value={formatDistanceToNow(Date.now() - systemInfo.os.uptime * 1000)}
					icon={<Clock className="h-4 w-4" />}
					trend="stable"
				/>
				<QuickStat
					title="CPU Load"
					value={`${latestCpuUsage.toFixed(1)}%`}
					icon={<ArrowUpRight className="h-4 w-4" />}
					trend={
						latestCpuUsage > 80
							? "critical"
							: latestCpuUsage > 60
								? "warning"
								: "good"
					}
				/>
				<QuickStat
					title="Memory Usage"
					value={`${((latestMemoryUsage / systemInfo.memory.total) * 100).toFixed(1)}%`}
					icon={<ArrowUpRight className="h-4 w-4" />}
					trend={
						latestMemoryUsage / systemInfo.memory.total > 0.8
							? "warning"
							: "good"
					}
				/>
				<QuickStat
					title="Network Traffic"
					value={`↓${formatBytes(latestNetworkIn)}/s ↑${formatBytes(latestNetworkOut)}/s`}
					icon={<ArrowUpRight className="h-4 w-4" />}
					trend="stable"
				/>
			</div>

			<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
				{/* System Information */}
				<Card>
					<CardHeader>
						<CardTitle>System Information</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							<InfoItem label="Hostname" value={systemInfo.hostname} />
							<InfoItem
								label="Operating System"
								value={`${systemInfo.os.type} ${systemInfo.os.release}`}
							/>
							<InfoItem
								label="CPU"
								value={`${systemInfo.cpu.model} (${systemInfo.cpu.cores} cores, ${systemInfo.cpu.threads} threads)`}
							/>
							<InfoItem
								label="Memory"
								value={`${formatBytes(systemInfo.memory.total)} ${systemInfo.memory.type} @ ${systemInfo.memory.speed}MHz`}
							/>
							<InfoItem
								label="Storage"
								value={systemInfo.storage.devices
									.map((d) => `${d.device} (${formatBytes(d.size)})`)
									.join(", ")}
							/>
						</div>
					</CardContent>
				</Card>

				{/* Recent Alerts */}
				<Card>
					<CardHeader>
						<CardTitle>Recent Alerts</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{alerts.map((alert) => (
								<div
									key={alert.id}
									className="bg-muted/50 flex items-start space-x-4 rounded-lg p-3"
								>
									<AlertCircle
										className={
											alert.severity === "warning"
												? "text-yellow-500"
												: "text-blue-500"
										}
									/>
									<div className="flex-1">
										<p className="font-medium">{alert.message}</p>
										<p className="text-muted-foreground text-sm">
											{alert.time}
										</p>
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

interface QuickStatProps {
	title: string;
	value: string;
	icon: React.ReactNode;
	trend: "good" | "warning" | "critical" | "stable";
}

function QuickStat({ title, value, icon, trend }: QuickStatProps) {
	const trendColors = {
		good: "text-green-500",
		warning: "text-yellow-500",
		critical: "text-red-500",
		stable: "text-blue-500",
	};

	return (
		<Card>
			<CardContent className="pt-6">
				<div className="flex items-center justify-between">
					<p className="text-muted-foreground text-sm font-medium">{title}</p>
					<div className={trendColors[trend]}>{icon}</div>
				</div>
				<div className="mt-2">
					<p className="text-2xl font-bold">{value}</p>
				</div>
			</CardContent>
		</Card>
	);
}

function InfoItem({ label, value }: { label: string; value: string }) {
	return (
		<div className="flex items-center justify-between">
			<span className="text-muted-foreground text-sm">{label}</span>
			<span className="max-w-[50%] text-sm font-medium">{value}</span>
		</div>
	);
}
