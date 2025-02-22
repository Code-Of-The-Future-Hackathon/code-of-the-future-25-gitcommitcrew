import { Overview } from "@/components/monitoring/overview";
import { generateMockData } from "@/lib/mock-data";

export default async function DeviceOverviewPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const mockData = generateMockData();
	const { id } = await params;

	return (
		<Overview
			systemInfo={mockData.systemInfo}
			metrics={mockData.metrics}
			deviceId={id}
		/>
	);
}
