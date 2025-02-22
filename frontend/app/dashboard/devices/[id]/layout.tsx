import { Sidebar } from "@/components/monitoring/sidebar";
import { generateMockData } from "@/lib/mock-data";
import { useSearchParams } from "next/navigation";

const mockData = generateMockData();

export default function DeviceLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const id = useSearchParams().get("id");
	if (!id) return null;

	return (
		<div className="bg-background flex h-screen">
			<Sidebar systemInfo={mockData.systemInfo} deviceId={id} />
			<main className="flex-1 overflow-auto">
				<div className="container mx-auto p-6">{children}</div>
			</main>
		</div>
	);
}
