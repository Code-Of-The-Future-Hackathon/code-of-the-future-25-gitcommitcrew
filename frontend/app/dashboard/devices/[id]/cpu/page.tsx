"use client";

import { CPUMetrics } from "@/components/monitoring/cpu-metrics";
import { generateMockData } from "@/lib/mock-data";

export default function DeviceCPUPage() {
	const mockData = generateMockData();

	return <CPUMetrics metrics={mockData.metrics.cpu} />;
}
