import { CPUMetrics } from "@/components/monitoring/cpu-metrics";
import { generateMockData } from "@/lib/mock-data";

export default async function DeviceCPUPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const mockData = generateMockData();
	const { id } = await params;

	return <CPUMetrics metrics={mockData.metrics.cpu} hostId={id} />;
}
