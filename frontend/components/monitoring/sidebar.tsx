"use client";

import { api } from "@/lib/api";
import { formatBytes } from "@/lib/utils";
import { SystemInfo } from "@/types/monitoring";
import {
	Cpu,
	MemoryStick,
	Network,
	HardDrive,
	Settings,
	Activity,
	Server,
	SquareFunction,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navigation = [
	{ name: "Overview", href: "", icon: Activity },
	{ name: "CPU", href: "/cpu", icon: Cpu },
	{ name: "Memory", href: "/memory", icon: MemoryStick },
	{ name: "Network", href: "/network", icon: Network },
	{ name: "Storage", href: "/storage", icon: HardDrive },
	{ name: "Settings", href: "/settings", icon: Settings },
	{ name: "Processes", href: "/process", icon: SquareFunction },
];

export function Sidebar({
	systemInfo,
	deviceId,
}: {
	systemInfo: SystemInfo;
	deviceId: string;
}) {
	const pathname = usePathname();

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

	return (
		<div className="bg-card w-64 border-r p-4">
			<div className="space-y-4">
				<div className="flex items-center space-x-2">
					<Server className="h-6 w-6" />
					<h2 className="text-lg font-semibold">{sysInformation.hostname}</h2>
				</div>

				<nav className="space-y-2">
					{navigation.map((item) => {
						const href = `/dashboard/devices/${deviceId}${item.href}`;
						const isActive = pathname === href;

						return (
							<Link
								key={item.name}
								href={href}
								className={`flex items-center space-x-2 rounded-lg px-3 py-2 transition-colors ${
									isActive
										? "bg-primary text-primary-foreground"
										: "hover:bg-accent"
								}`}
							>
								<item.icon className="h-4 w-4" />
								<span>{item.name}</span>
							</Link>
						);
					})}
				</nav>

				<div className="border-t pt-4">
					<h3 className="mb-2 text-sm font-medium">System Information</h3>
					<div className="text-muted-foreground space-y-2 text-sm">
						<div>OS: {sysInformation.distro || ""}</div>
						<div>CPU: {sysInformation.brand || ""}</div>

						<div>Disk: {sysInformation.disk || ""}</div>
					</div>
				</div>
			</div>
		</div>
	);
}
