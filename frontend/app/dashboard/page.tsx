import { getCurrentSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AddDeviceButton } from "@/components/dashboard/add-device-button";
import { HostGrid } from "@/components/dashboard/host-grid";
import { Clock } from "lucide-react";

// Mock data for unclaimed hosts
const MOCK_UNCLAIMED_HOSTS = [
	{
		id: "1",
		hostname: "server-01",
		mac: "00:1B:44:11:3A:B7",
		ip: "192.168.1.100",
		org: "Acme Corp",
		claimed: false,
	},
	{
		id: "2",
		hostname: "server-02",
		mac: "00:1B:44:11:3A:B8",
		ip: "192.168.1.101",
		org: "Acme Corp",
		claimed: false,
	},
];

// Mock data for claimed hosts
const MOCK_CLAIMED_HOSTS = [
	{
		id: "3",
		hostname: "web-server-01",
		mac: "00:1B:44:11:3A:B9",
		ip: "192.168.1.102",
		org: "Acme Corp",
		claimed: true,
		stats: {
			cpu: 45,
			memory: 62,
			disk: 38,
			status: "online",
		},
	},
];

export default async function DashboardPage({
	searchParams,
}: {
	searchParams: Promise<{ org: string }>;
}) {
	const { user } = await getCurrentSession();
	if (!user) redirect("/auth");

	// In reality, you would fetch hosts based on the org ID
	const { org } = await searchParams;

	return (
		<div className="space-y-8">
			{/* Header */}
			<div className="flex items-center justify-between">
				<h1 className="text-3xl font-bold">Devices</h1>
				<AddDeviceButton unclaimedHosts={MOCK_UNCLAIMED_HOSTS} />
			</div>

			{/* Host Grid */}
			<HostGrid hosts={MOCK_CLAIMED_HOSTS} />
		</div>
	);
}
