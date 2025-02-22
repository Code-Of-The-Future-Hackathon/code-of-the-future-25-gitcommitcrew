import { SystemInfo, SystemMetrics } from "@/types/monitoring";

export function generateMockData(): {
	systemInfo: SystemInfo;
	metrics: SystemMetrics;
} {
	const systemInfo: SystemInfo = {
		hostname: "mock-server-01",
		os: {
			type: "Linux",
			platform: "x64",
			release: "5.15.0-1019",
			uptime: 1209600, // 14 days in seconds
		},
		cpu: {
			model: "Intel(R) Core(TM) i7-9750H CPU @ 2.60GHz",
			cores: 6,
			threads: 12,
			baseSpeed: 2600,
		},
		memory: {
			total: 16 * 1024 * 1024 * 1024, // 16GB in bytes
			type: "DDR4",
			speed: 3200,
		},
		network: {
			interfaces: [
				{
					name: "eth0",
					mac: "00:1B:44:11:3A:B7",
					ipv4: "192.168.1.100",
					ipv6: "fe80::1b44:11ff:fe3a:b700",
				},
				{
					name: "wlan0",
					mac: "00:1B:44:11:3A:B8",
					ipv4: "192.168.1.101",
					ipv6: "fe80::1b44:11ff:fe3a:b800",
				},
			],
		},
		storage: {
			devices: [
				{
					device: "/dev/sda",
					type: "SSD",
					size: 512 * 1024 * 1024 * 1024, // 512GB
					mountPoint: "/",
				},
				{
					device: "/dev/sdb",
					type: "HDD",
					size: 1024 * 1024 * 1024 * 1024, // 1TB
					mountPoint: "/data",
				},
			],
		},
	};

	// Generate mock time series data
	const now = Date.now();
	const points = 100;
	const metrics: SystemMetrics = {
		cpu: {
			usage: Array.from({ length: points }, (_, i) => ({
				timestamp: now - (points - i) * 60000,
				value: 30 + Math.random() * 40,
			})),
			temperature: Array.from({ length: points }, (_, i) => ({
				timestamp: now - (points - i) * 60000,
				value: 40 + Math.random() * 20,
			})),
			frequency: Array.from({ length: points }, (_, i) => ({
				timestamp: now - (points - i) * 60000,
				value: 3400 + Math.random() * 1000,
			})),
			perCore: Array.from({ length: systemInfo.cpu.cores }, (_, core) => ({
				core,
				usage: Array.from({ length: points }, (_, i) => ({
					timestamp: now - (points - i) * 60000,
					value: 20 + Math.random() * 60,
				})),
			})),
		},
		memory: {
			total: 68719476736, // 64GB
			used: Array.from({ length: points }, (_, i) => ({
				timestamp: now - (points - i) * 60000,
				value: 20000000000 + Math.random() * 30000000000,
			})),
			swap: Array.from({ length: points }, (_, i) => ({
				timestamp: now - (points - i) * 60000,
				value: 1000000000 + Math.random() * 2000000000,
			})),
		},
		network: {
			rx_bytes: Array.from({ length: points }, (_, i) => ({
				timestamp: now - (points - i) * 60000,
				value: Math.random() * 100000000,
			})),
			tx_bytes: Array.from({ length: points }, (_, i) => ({
				timestamp: now - (points - i) * 60000,
				value: Math.random() * 80000000,
			})),
			connections: Array.from({ length: points }, (_, i) => ({
				timestamp: now - (points - i) * 60000,
				value: 100 + Math.random() * 200,
			})),
			interfaces: [
				{
					name: "eth0",
					status: "up",
					mac: "00:1B:44:11:3A:B7",
					ipv4: "192.168.1.100",
					ipv6: "fe80::21b:44ff:fe11:3ab7",
				},
				{
					name: "eth1",
					status: "down",
					mac: "00:1B:44:11:3A:B8",
					ipv4: "192.168.1.101",
					ipv6: "fe80::21b:44ff:fe11:3ab8",
				},
			],
		},
		storage: {
			read_bytes: Array.from({ length: points }, (_, i) => ({
				timestamp: now - (points - i) * 60000,
				value: Math.random() * 50000000,
			})),
			write_bytes: Array.from({ length: points }, (_, i) => ({
				timestamp: now - (points - i) * 60000,
				value: Math.random() * 30000000,
			})),
			iops: Array.from({ length: points }, (_, i) => ({
				timestamp: now - (points - i) * 60000,
				value: Math.random() * 1000,
			})),
			devices: [
				{
					mount: "/",
					size: 1000204886016,
					used: 450204886016,
					device: "/dev/nvme0n1",
				},
				{
					mount: "/home",
					size: 2000204886016,
					used: 1200204886016,
					device: "/dev/nvme0n2",
				},
			],
		},
		processes: {
			total: Array.from({ length: points }, (_, i) => ({
				timestamp: now - (points - i) * 60000,
				value: 200 + Math.random() * 50,
			})),
			running: Array.from({ length: points }, (_, i) => ({
				timestamp: now - (points - i) * 60000,
				value: 150 + Math.random() * 30,
			})),
			blocked: Array.from({ length: points }, (_, i) => ({
				timestamp: now - (points - i) * 60000,
				value: Math.random() * 10,
			})),
			topProcesses: [
				{ pid: 1, name: "systemd", cpu: 0.5, memory: 0.8, state: "running" },
				{ pid: 2043, name: "nginx", cpu: 15.2, memory: 2.3, state: "running" },
				{
					pid: 3012,
					name: "postgres",
					cpu: 12.1,
					memory: 8.4,
					state: "running",
				},
				{ pid: 4201, name: "node", cpu: 25.4, memory: 5.2, state: "running" },
				{ pid: 5332, name: "redis", cpu: 8.7, memory: 1.8, state: "sleeping" },
			],
		},
	};
	return { systemInfo, metrics };
}
