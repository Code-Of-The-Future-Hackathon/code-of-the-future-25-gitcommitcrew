import si, {
	battery,
	cpuCurrentSpeed,
	cpuFlags,
	cpuTemperature,
	memLayout,
	osInfo,
	processes,
} from "systeminformation";

// const cpu = await si.get({
// 	cpu: "manufacturer, brand, speed, speedMin, speedMax, cores, physicalCores, processors",
// 	cpuCurrentSpeed: "*",
// 	cpuTemperature: "*",
// });

// const memory = await si.get({
// 	mem: "total, free, used, active, slab, available, swaptotal, swapused, swapfree",
// diskLayout: "*",
// });

// const battery = await si.get({
// 	battery:
// 		"hasBattery, isCharging, maxCapacity, currentCapacity, percent, timeRemaining, voltage, manufacturer",
// });

// const osInfo = await si.get({
// 	osInfo: "platform, distro, kernel, hostname",
// 	users: "*",
// });

const services = await si.services("*");

Bun.write("processes.json", JSON.stringify(services, null, 2));

// const processes = await si.get({
// 	currentLoad:
// 		"avgLoad, currentLoad, currentLoadUser, currentLoadSystem, currentLoadNice, currentLoadIdle, currentLoadIrq, rawCurrentLoad, cpus",
// 	processes: "*",
// });

// Bun.write("processes.json", JSON.stringify(processes, null, 2));
