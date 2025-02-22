import { Sidebar } from "@/components/monitoring/sidebar";
import { getCurrentSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { generateMockData } from "@/lib/mock-data";

// In reality, this would be fetched based on the device ID
const mockData = generateMockData();

export default async function DeviceLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: Promise<{ id: string }>;
}) {
	const { user } = await getCurrentSession();
	if (!user) redirect("/auth");

	const { id } = await params;

	return (
		<div className="bg-background flex h-screen">
			<Sidebar systemInfo={mockData.systemInfo} deviceId={id} />
			<main className="flex-1 overflow-auto">
				<div className="container mx-auto p-6">{children}</div>
			</main>
		</div>
	);
}
