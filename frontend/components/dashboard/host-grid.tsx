"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Server, HardDrive, Cpu, MemoryStick } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { THost } from "../../../backend/src/services/system/models/hosts";
import { TSystemData } from "../../../backend/src/services/system/models/systemData";
import { api } from "@/lib/api";
import { EventData } from "../../../events";

export function HostGrid({ hosts }: { hosts: THost[] }) {
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

function HostCard({ host }: { host: THost }) {
	const [latestData, setLatestData] = useState<TSystemData[] | null>(null);

	useEffect(() => {
		api
			.post("/system/host/latest", {
				hostId: host.id,
				types: ["memory", "disk", "process"],
			})
			.then(({ data }) => {
				if (data.success) {
					setLatestData(data.data);
					console.log(data.data);
				}
			});
	}, []);

	useEffect(() => {
		console.log(latestData);
	}, [latestData]);

	if (!latestData) return null;

	const memory = latestData.find((d) => d.type === "memory");
	const disk = latestData.find((d) => d.type === "disk");
	const process = latestData.find((d) => d.type === "process");

	if (!memory || !disk || !process) {
		return null;
	}

	const memoryData = memory.data as Extract<EventData, { type: "memory" }>;
	const diskData = disk.data as Extract<EventData, { type: "disk" }>;
	const processData = process.data as Extract<EventData, { type: "process" }>;

	const totalDiskUse = diskData.data.fsSize.reduce(
		(acc, curr) => (acc += curr.used),
		0,
	);

	const totalDisk = diskData.data.fsSize.reduce(
		(acc, curr) => (acc += curr.size),
		0,
	);

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
						value={`${processData.data.currentLoad.currentLoad.toFixed(2) || 0}%`}
					/>
					<Metric
						icon={<MemoryStick className="h-4 w-4" />}
						label="Memory"
						value={`${((1 - memoryData.data.mem.available / memoryData.data.mem.total) * 100).toFixed(2) || 0}%`}
					/>
					<Metric
						icon={<HardDrive className="h-4 w-4" />}
						label="Disk"
						value={`${((totalDiskUse / totalDisk) * 100).toFixed(2) || 0}%`}
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
