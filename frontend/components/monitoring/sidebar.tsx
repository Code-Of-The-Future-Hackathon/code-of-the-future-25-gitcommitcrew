"use client";

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
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
	{ name: "Overview", href: "", icon: Activity },
	{ name: "CPU", href: "/cpu", icon: Cpu },
	{ name: "Memory", href: "/memory", icon: MemoryStick },
	{ name: "Network", href: "/network", icon: Network },
	{ name: "Storage", href: "/storage", icon: HardDrive },
	{ name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar({
	systemInfo,
	deviceId,
}: {
	systemInfo: SystemInfo;
	deviceId: string;
}) {
	const pathname = usePathname();

	return (
		<div className="bg-card w-64 border-r p-4">
			<div className="space-y-4">
				<div className="flex items-center space-x-2">
					<Server className="h-6 w-6" />
					<h2 className="text-lg font-semibold">{systemInfo.hostname}</h2>
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
						<div>
							OS: {systemInfo.os.type} {systemInfo.os.release}
						</div>
						<div>CPU: {systemInfo.cpu.model}</div>
						<div>
							Cores: {systemInfo.cpu.cores}/{systemInfo.cpu.threads}
						</div>
						<div>Memory: {formatBytes(systemInfo.memory.total)}</div>
					</div>
				</div>
			</div>
		</div>
	);
}
