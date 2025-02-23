import { MemoryMetrics } from "@/components/monitoring/memory-metrics";
import { generateMockData } from "@/lib/mock-data";

export default async function DeviceMemoryPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const mockData = generateMockData();
	const { id } = await params;

	return <MemoryMetrics metrics={mockData.metrics.memory} hostId={id} />;
}
