const enum events {
	HOST_CONNECTION = "host:connection",
	HOST_NEW_DATA = "host:new:data",
	HOST_UPDATE_INTERVAL = "host:update:interval",
	HOST_UPDATE_QUERY = "host:update:query",
	HOST_STOP = "host:stop",
	HOST_START = "host:start",
	HOST_TERMINATE = "host:terminate",

	SERVER_NEW_DATA = "server:new:data",
	CLIENT_REQUEST_DATA = "client:request:data",
}

type Data =
	| "cpu"
	| "memory"
	| "system"
	| "battery"
	| "network"
	| "disk"
	| "process";

type CpuData = {
	cpu: {
		manufacturer: string;
		brand: string;
		speed: number;
		speedMin: number;
		speedMax: number;
		cores: number;
		physicalCores: number;
		processors: number;
	};
	cpuCurrentSpeed: {
		min: number;
		max: number;
		avg: number;
		cores: number[];
	};
	cpuTemperature: {
		main: number;
		cores: number[];
		max: number;
		socket: number[];
		chipset: number | null;
	};
};

type MemoryData = {
	mem: {
		total: number;
		free: number;
		used: number;
		active: number;
		slab: number;
		available: number;
		swaptotal: number;
		swapused: number;
		swapfree: number;
	};
	diskLayout: {
		device: string;
		type: string;
		name: string;
		vendor: string;
		size: number;
		bytesPerSector: number | null;
		totalCylinders: number | null;
		totalHeads: number | null;
		totalSectors: number | null;
		totalTracks: number | null;
		tracksPerCylinder: number | null;
		sectorsPerTrack: number | null;
		firmwareRevision: string;
		serialNum: string;
		interfaceType: string;
		smartStatus: string;
		temperature: number | null;
	}[];
};

type SystemData = {
	osInfo: {
		platform: string;
		distro: string;
		kernel: string;
		hostname: string;
	};
	users: {
		user: string;
		tty: string;
		date: string;
		time: string;
		ip: string;
		command: string;
	}[];
};

type BatteryData = {
	battery: {
		hasBattery: boolean;
		isCharging: boolean;
		maxCapacity: number;
		currentCapacity: number;
		percent: number;
		timeRemaining: number;
		voltage: number;
		manufacturer: string;
	};
};

type ProcessData = {
	currentLoad: {
		avgLoad: number;
		currentLoad: number;
		currentLoadUser: number;
		currentLoadSystem: number;
		currentLoadNice: number;
		currentLoadIdle: number;
		currentLoadIrq: number;
		rawCurrentLoad: number;
		cpus: {
			load: number;
			loadUser: number;
			loadSystem: number;
			loadNice: number;
			loadIdle: number;
			loadIrq: number;
			loadSteal: number;
			loadGuest: number;
			rawLoad: number;
			rawLoadUser: number;
			rawLoadSystem: number;
			rawLoadNice: number;
			rawLoadIdle: number;
			rawLoadIrq: number;
			rawLoadSteal: number;
			rawLoadGuest: number;
		}[];
	};
	processes: {
		all: number;
		running: number;
		blocked: number;
		sleeping: number;
		unknown: number;
		list: {
			pid: number;
			parentPid: number;
			name: string;
			cpu: number;
			cpuu: number;
			cpus: number;
			mem: number;
			priority: number;
			memVsz: number;
			memRss: number;
			nice: number;
			started: string;
			state: string;
			tty: string;
			user: string;
			command: string;
			params: string;
			path: string;
		}[];
	};
};

type NetworkData = {
	networkStats: {
		iface: string;
		operstate: string;
		rx_bytes: number;
		rx_dropped: number;
		rx_errors: number;
		tx_bytes: number;
		tx_dropped: number;
		tx_errors: number;
		rx_sec: number | null;
		tx_sec: number | null;
		ms: number;
	}[];
	networkConnections: {
		protocol: string;
		localAddress: string;
		localPort: string;
		peerAddress: string;
		peerPort: string;
		state: string;
		pid: number | null;
		process: string;
	}[];
};

type DiskData = {
	diskLayout: {
		device: string;
		type: string;
		name: string;
		vendor: string;
		size: number;
		bytesPerSector: number | null;
		totalCylinders: number | null;
		totalHeads: number | null;
		totalSectors: number | null;
		totalTracks: number | null;
		tracksPerCylinder: number | null;
		sectorsPerTrack: number | null;
		firmwareRevision: string;
		serialNum: string;
		interfaceType: string;
		smartStatus: string;
		temperature: number | null;
	}[];
	fsSize: {
		fs: string;
		type: string;
		size: number;
		used: number;
		available: number;
		use: number;
		mount: string;
		rw: boolean;
	}[];
};

type EventData =
	| { type: "cpu"; data: CpuData; passwordHash: string; mac: string }
	| { type: "memory"; data: MemoryData; passwordHash: string; mac: string }
	| { type: "system"; data: SystemData; passwordHash: string; mac: string }
	| { type: "battery"; data: BatteryData; passwordHash: string; mac: string }
	| { type: "process"; data: ProcessData; passwordHash: string; mac: string }
	| { type: "network"; data: NetworkData; passwordHash: string; mac: string }
	| { type: "disk"; data: DiskData; passwordHash: string; mac: string };

export { events };

export type { Data, EventData };
