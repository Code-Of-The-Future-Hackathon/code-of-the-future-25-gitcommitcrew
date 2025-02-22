"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Host } from "@/lib/db/schema";
import { Server, HardDrive, Cpu, MemoryStick } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";

export function HostGrid({ hosts }: { hosts: Host[] }) {
	if (hosts.length === 0) {
		return (
			<div className="py-12 text-center">
				<Server className="text-muted-foreground mx-auto h-12 w-12" />
				<h3 className="mt-4 text-lg font-semibold">No devices to monitor</h3>
				<p className="text-muted-foreground mt-2">
					Add a new device to start monitoring
				</p>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
			{hosts.map((host) => (
				<HostCard key={host.id} host={host} />
			))}
		</div>
	);
}

function HostCard({ host }: { host: Host }) {
	return (
		<Card className="transition-shadow hover:shadow-lg">
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-lg font-medium">{host.hostname}</CardTitle>
				<StatusBadge status={host.claimed ? "Claimed" : "???"} />
			</CardHeader>
			<CardContent>
				<div className="grid grid-cols-2 gap-4">
					<Metric
						icon={<Cpu className="h-4 w-4" />}
						label="CPU"
						value={`${host.stats?.cpu || 0}%`}
					/>
					<Metric
						icon={<MemoryStick className="h-4 w-4" />}
						label="Memory"
						value={`${host.stats?.memory || 0}%`}
					/>
					<Metric
						icon={<HardDrive className="h-4 w-4" />}
						label="Disk"
						value={`${host.stats?.disk || 0}%`}
					/>
					<Metric
						icon={<Server className="h-4 w-4" />}
						label="IP"
						value={host.ip}
					/>
				</div>
				<div className="my-2 flex justify-end">
					<Link href={`/dashboard/devices/${host.id}`}>
						<Button className="bg-blue-500 text-white shadow-blue-600">
							Manage
						</Button>
					</Link>
				</div>
			</CardContent>
		</Card>
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
			className={`rounded-full px-2 py-1 text-xs ${
				colors[status as keyof typeof colors]
			}`}
		>
			{status}
		</span>
	);
}

function Metric({
	icon,
	label,
	value,
}: {
	icon: React.ReactNode;
	label: string;
	value: string;
}) {
	return (
		<div className="flex flex-col space-y-1">
			<div className="text-muted-foreground flex items-center space-x-2">
				{icon}
				<span className="text-sm">{label}</span>
			</div>
			<span className="text-sm font-medium">{value}</span>
		</div>
	);
}
