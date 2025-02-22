import { Overview } from "@/components/monitoring/overview";
import { generateMockData } from "@/lib/mock-data";

export default function DeviceOverviewPage() {
	const mockData = generateMockData();

	return (
		<Overview systemInfo={mockData.systemInfo} metrics={mockData.metrics} />
	);
}
