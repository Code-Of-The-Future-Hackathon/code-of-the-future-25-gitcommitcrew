import { StorageMetrics } from "@/components/monitoring/storage-metrics";
import { generateMockData } from "@/lib/mock-data";

export default async function DeviceStoragePage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const mockData = generateMockData();
	const { id } = await params;

	return <StorageMetrics metrics={mockData.metrics.storage} hostId={id} />;
}
