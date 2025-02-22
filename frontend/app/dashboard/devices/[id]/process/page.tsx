import { ProcessMetrics } from "@/components/monitoring/process-metrics";
import { generateMockData } from "@/lib/mock-data";

export default function DeviceProcessPage() {
	const mockData = generateMockData();

	return <ProcessMetrics metrics={mockData.metrics.processes} />;
}
