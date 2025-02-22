import { NetworkMetrics } from "@/components/monitoring/network-metrics";
import { generateMockData } from "@/lib/mock-data";

export default function DeviceNetworkPage() {
	const mockData = generateMockData();

	return <NetworkMetrics metrics={mockData.metrics.network} />;
}
