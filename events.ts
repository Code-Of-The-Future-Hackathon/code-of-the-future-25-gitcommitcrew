const enum events {
	HOST_CONNECTION = "host:connection",
	SYSTEM_DATA = "system:data",
	// SYSTEM_DATA = "system:data",
	// CPU_DATA = "cpu:data",
	// MEMORY_DATA = "memory:data",
	// NETWORK_DATA = "network:data",
	// DISK_DATA = "disk:data",
	// PROCESS_DATA = "process:data",
}

type Data = "system" | "cpu" | "memory" | "network" | "disk" | "process";

export { events };

export type { Data };
