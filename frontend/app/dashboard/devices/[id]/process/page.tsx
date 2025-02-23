import { ProcessMetrics } from "@/components/monitoring/process-metrics";
import { generateMockData } from "@/lib/mock-data";

export default async function DeviceProcessPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const mockData = generateMockData();
	const { id } = await params;

	return <ProcessMetrics metrics={mockData.metrics.processes} hostId={id} />;
}
