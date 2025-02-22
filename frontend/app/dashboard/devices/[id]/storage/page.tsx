import { StorageMetrics } from "@/components/monitoring/storage-metrics";
import { generateMockData } from "@/lib/mock-data";

export default function DeviceStoragePage() {
	const mockData = generateMockData();

	return <StorageMetrics metrics={mockData.metrics.storage} />;
}
