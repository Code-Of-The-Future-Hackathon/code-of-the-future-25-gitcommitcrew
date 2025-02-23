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

export interface NetworkInterface {
	name: string;
	status: string;
	mac: string;
	ipv4: string;
	ipv6: string;
}

export interface StorageDevice {
	mount: string;
	size: number;
	used: number;
	device: string;
}

export interface Process {
	pid: number;
	name: string;
	cpu: number;
	memory: number;
	state: string;
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
		total: number;
		used: MetricData[];
		swap: MetricData[];
	};
	network: {
		rx_bytes: MetricData[];
		tx_bytes: MetricData[];
		connections: MetricData[];
		interfaces: NetworkInterface[];
	};
	storage: {
		read_bytes: MetricData[];
		write_bytes: MetricData[];
		iops: MetricData[];
		devices: StorageDevice[];
	};
	processes: {
		total: MetricData[];
		running: MetricData[];
		blocked: MetricData[];
		topProcesses: Process[];
	};
}
