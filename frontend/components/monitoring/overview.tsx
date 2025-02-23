"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Clock, ArrowUpRight } from "lucide-react";
import { SystemInfo, SystemMetrics } from "@/types/monitoring";
import { formatBytes } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { useUser } from "@/context/user";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

interface OverviewProps {
	systemInfo: SystemInfo;
	metrics: SystemMetrics;
	deviceId: string;
}

export function Overview({ systemInfo, metrics, deviceId }: OverviewProps) {
	// Get the latest values from metrics

	const [sysInformation, setSysInformation] = useState<any>({});
	useEffect(() => {
		const asFn = async () => {
			const { data } = await api.post("/system/host/system", {
				hostId: deviceId,
			});
			console.log(data);
			if (data.success) {
				const system = data.data.system.data;
				const cpu = data.data.cpu.data.data;
				const disk = data.data.disk.data.data.diskLayout[0].name;
				console.log(cpu);
				console.log(data);
				console.log(system);
				setSysInformation({
					hostname: system.data.osInfo.hostname,
					distro: system.data.osInfo.distro,
					brand: cpu.cpu.brand,
					disk,
				});
			}
		};

		asFn();
	}, []);

	const latestCpuUsage = metrics.cpu.usage[metrics.cpu.usage.length - 1].value;
	const latestMemoryUsage =
		metrics.memory.used[metrics.memory.used.length - 1].value;
	const latestNetworkIn =
		metrics.network.rx_bytes[metrics.network.rx_bytes.length - 1].value;
	const latestNetworkOut =
		metrics.network.tx_bytes[metrics.network.tx_bytes.length - 1].value;

	const { user } = useUser();

	return (
		<section id="overview" className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-2xl font-bold">System Overview</h2>
					<p className="text-muted-foreground">
						Last updated: {new Date().toLocaleTimeString()}
					</p>
				</div>
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
							<InfoItem
								label="Hostname"
								value={sysInformation.hostname || ""}
							/>
							<InfoItem
								label="Operating System"
								value={`${sysInformation.distro || ""}`}
							/>
							<InfoItem label="CPU" value={`${sysInformation.brand || ""}`} />

							<InfoItem label="Storage" value={sysInformation.disk || ""} />
						</div>
					</CardContent>
				</Card>

				{/* Recent Alerts */}
				<Card>
					<CardHeader>
						<CardTitle>Recent Alerts</CardTitle>
					</CardHeader>
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
