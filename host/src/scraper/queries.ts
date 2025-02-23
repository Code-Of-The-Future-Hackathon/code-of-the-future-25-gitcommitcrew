export const queries = {
	cpu: {
		cpu: "manufacturer, brand, speed, speedMin, speedMax, cores, physicalCores, processors",
		cpuCurrentSpeed: "*",
		cpuTemperature: "*",
	},
	memory: {
		mem: "total, free, used, active, slab, available, swaptotal, swapused, swapfree",
	},
	system: {
		osInfo: "platform, distro, kernel, hostname",
		users: "*",
	},
	battery: {
		battery:
			"hasBattery, isCharging, maxCapacity, currentCapacity, percent, timeRemaining, voltage, manufacturer",
	},
	process: {
		currentLoad:
			"avgLoad, currentLoad, currentLoadUser, currentLoadSystem, currentLoadNice, currentLoadIdle, currentLoadIrq, rawCurrentLoad, cpus",
	},
	network: {
		networkStats: "*",
	},
	disk: { diskLayout: "*", fsSize: "*" },
};
