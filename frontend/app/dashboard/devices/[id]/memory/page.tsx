import { MemoryMetrics } from "@/components/monitoring/memory-metrics";
import { generateMockData } from "@/lib/mock-data";

export default function DeviceMemoryPage() {
	const mockData = generateMockData();

	return <MemoryMetrics metrics={mockData.metrics.memory} />;
}
