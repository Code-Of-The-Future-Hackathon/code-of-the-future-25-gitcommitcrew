import { getCurrentSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Cpu,
	HardDrive,
	Clock,
	AlertCircle,
	Server,
	MemoryStickIcon,
} from "lucide-react";

export default async function DashboardPage() {
	const { user } = await getCurrentSession();
	if (!user) redirect("/auth");

	// Mock data - replace with real data later
	const mockHosts = [
		{ id: 1, name: "srv-01", status: "online", cpu: 45, memory: 62, disk: 38 },
		{ id: 2, name: "srv-02", status: "online", cpu: 78, memory: 45, disk: 72 },
		{ id: 3, name: "srv-03", status: "offline", cpu: 0, memory: 0, disk: 81 },
		{ id: 4, name: "srv-04", status: "online", cpu: 25, memory: 89, disk: 45 },
	];

	const alerts = [
		{
			id: 1,
			severity: "high",
			message: "High CPU usage on srv-02",
			time: "2m ago",
		},
		{
			id: 2,
			severity: "medium",
			message: "Memory usage above 80% on srv-04",
			time: "5m ago",
		},
		{
			id: 3,
			severity: "low",
			message: "Disk space warning on srv-01",
			time: "15m ago",
		},
	];

	return (
		<div className="container mx-auto p-6">
			{/* Header */}
			<div className="mb-8 flex items-center justify-between">
				<h1 className="text-3xl font-bold">Infrastructure Dashboard</h1>
				<div className="flex items-center gap-4">
					<StatusIndicator status="Operational" />
					<Clock className="h-5 w-5" />
					<span>{new Date().toLocaleTimeString()}</span>
				</div>
			</div>

			{/* Overview Stats */}
			<div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
				<MetricCard
					title="Total Hosts"
					value="4"
					icon={<Server className="h-6 w-6" />}
					trend="+1 from last week"
				/>
				<MetricCard
					title="Avg CPU Load"
					value="49.3%"
					icon={<Cpu className="h-6 w-6" />}
					trend="+5% from last hour"
				/>
				<MetricCard
					title="Memory Usage"
					value="65.3%"
					icon={<MemoryStickIcon className="h-6 w-6" />}
					trend="-2% from last hour"
				/>
				<MetricCard
					title="Storage Used"
					value="59.0%"
					icon={<HardDrive className="h-6 w-6" />}
					trend="+0.5% from yesterday"
				/>
			</div>

			{/* Main Grid */}
			<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
				{/* Host List */}
				<Card className="lg:col-span-2">
					<CardHeader>
						<CardTitle>Host Status</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{mockHosts.map((host) => (
								<HostStatusCard key={host.id} host={host} />
							))}
						</div>
					</CardContent>
				</Card>

				{/* Alerts Panel */}
				<Card>
					<CardHeader>
						<CardTitle>Recent Alerts</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{alerts.map((alert) => (
								<AlertCard key={alert.id} alert={alert} />
							))}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}

function StatusIndicator({ status }: { status: string }) {
	return (
		<div className="flex items-center gap-2">
			<div className="h-2 w-2 rounded-full bg-green-500" />
			<span className="text-sm">{status}</span>
		</div>
	);
}

function MetricCard({
	title,
	value,
	icon,
	trend,
}: {
	title: string;
	value: string;
	icon: React.ReactNode;
	trend: string;
}) {
	return (
		<Card>
			<CardContent className="pt-6">
				<div className="mb-4 flex items-center justify-between">
					<span className="text-muted-foreground">{title}</span>
					{icon}
				</div>
				<div className="mb-2 text-2xl font-bold">{value}</div>
				<div className="text-muted-foreground text-sm">{trend}</div>
			</CardContent>
		</Card>
	);
}

function HostStatusCard({ host }: { host: any }) {
	return (
		<div className="rounded-lg border p-4">
			<div className="mb-4 flex items-center justify-between">
				<div className="flex items-center gap-3">
					<Server className="h-5 w-5" />
					<span className="font-medium">{host.name}</span>
				</div>
				<StatusBadge status={host.status} />
			</div>
			<div className="grid grid-cols-3 gap-4">
				<ResourceMeter
					label="CPU"
					value={host.cpu}
					icon={<Cpu className="h-4 w-4" />}
				/>
				<ResourceMeter
					label="Memory"
					value={host.memory}
					icon={<MemoryStickIcon className="h-4 w-4" />}
				/>
				<ResourceMeter
					label="Disk"
					value={host.disk}
					icon={<HardDrive className="h-4 w-4" />}
				/>
			</div>
		</div>
	);
}

function ResourceMeter({
	label,
	value,
	icon,
}: {
	label: string;
	value: number;
	icon: React.ReactNode;
}) {
	return (
		<div>
			<div className="mb-2 flex items-center gap-2">
				{icon}
				<span className="text-muted-foreground text-sm">{label}</span>
			</div>
			<div className="bg-secondary h-2 overflow-hidden rounded-full">
				<div
					className={`h-full rounded-full ${
						value > 80
							? "bg-red-500"
							: value > 60
								? "bg-yellow-500"
								: "bg-green-500"
					}`}
					style={{ width: `${value}%` }}
				/>
			</div>
			<span className="mt-1 block text-sm">{value}%</span>
		</div>
	);
}

function StatusBadge({ status }: { status: string }) {
	const colors = {
		online: "bg-green-500/10 text-green-500",
		offline: "bg-red-500/10 text-red-500",
		warning: "bg-yellow-500/10 text-yellow-500",
	};

	return (
		<span
			className={`rounded-full px-2 py-1 text-xs ${colors[status as keyof typeof colors]}`}
		>
			{status}
		</span>
	);
}

function AlertCard({ alert }: { alert: any }) {
	const severityColors = {
		high: "text-red-500",
		medium: "text-yellow-500",
		low: "text-blue-500",
	};

	return (
		<div className="flex items-start gap-3 rounded-lg border p-3">
			<AlertCircle
				className={`mt-0.5 h-5 w-5 ${severityColors[alert.severity as keyof typeof severityColors]}`}
			/>
			<div>
				<p className="text-sm">{alert.message}</p>
				<span className="text-muted-foreground text-xs">{alert.time}</span>
			</div>
		</div>
	);
}
