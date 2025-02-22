import { Overview } from "@/components/monitoring/overview";
import { getCurrentSession } from "@/lib/auth";
import { generateMockData } from "@/lib/mock-data";
import { redirect } from "next/navigation";

export default async function DeviceOverviewPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const mockData = generateMockData();
	const { id } = await params;

	const { user } = await getCurrentSession();
	if (!user) redirect("/dashboard");

	return (
		<Overview
			systemInfo={mockData.systemInfo}
			metrics={mockData.metrics}
			deviceId={id}
			user={user}
		/>
	);
}
