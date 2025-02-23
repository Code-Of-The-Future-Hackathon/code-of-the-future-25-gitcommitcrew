import { Sidebar } from "@/components/monitoring/sidebar";
import { generateMockData } from "@/lib/mock-data";

const mockData = generateMockData();

export default async function DeviceLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: Promise<{ id: string }>;
}) {
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
