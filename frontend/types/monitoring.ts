export interface SystemInfo {
	hostname: string;
	os: {
		type: string;
		platform: string;
		release: string;
		uptime: number;
	};
	cpu: {
		model: string;
		cores: number;
		threads: number;
		baseSpeed: number;
	};
	memory: {
		total: number;
		type: string;
		speed: number;
	};
	network: {
		interfaces: {
			name: string;
			mac: string;
			ipv4: string;
			ipv6: string;
		}[];
	};
	storage: {
		devices: {
			device: string;
			type: string;
			size: number;
			mountPoint: string;
		}[];
	};
}

export interface MetricData {
	timestamp: number;
	value: number;
}

export interface SystemMetrics {
	cpu: {
		usage: MetricData[];
		temperature: MetricData[];
		frequency: MetricData[];
		perCore: {
			core: number;
			usage: MetricData[];
		}[];
	};
	memory: {
		used: MetricData[];
		swap: MetricData[];
	};
	network: {
		rx_bytes: MetricData[];
		tx_bytes: MetricData[];
		connections: MetricData[];
	};
	storage: {
		read_bytes: MetricData[];
		write_bytes: MetricData[];
		iops: MetricData[];
	};
	processes: {
		total: MetricData[];
		running: MetricData[];
		blocked: MetricData[];
	};
}

export type TimeInterval =
	| "5s"
	| "10s"
	| "30s"
	| "1m"
	| "5m"
	| "15m"
	| "30m"
	| "1h"
	| "3h"
	| "6h"
	| "12h"
	| "24h";
