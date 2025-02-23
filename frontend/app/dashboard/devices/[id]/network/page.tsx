import { NetworkMetrics } from "@/components/monitoring/network-metrics";
import { generateMockData } from "@/lib/mock-data";

export default async function DeviceNetworkPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const mockData = generateMockData();
	const { id } = await params;

	return <NetworkMetrics metrics={mockData.metrics.network} hostId={id} />;
}
