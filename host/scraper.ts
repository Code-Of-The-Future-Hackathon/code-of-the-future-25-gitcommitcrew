import { get } from "systeminformation";
import { io } from "@/server/config/socket";
import { events, type Data } from "../events";
import { globalConfig } from "./src";

const DEFAULT_TIMER = 60 * 1000;
const LONG_TIMER = 5 * DEFAULT_TIMER;

class Scraper {
	query: object;
	type: Data;
	timer: number;
	running: boolean;
	private interval: Timer | null;

	private emit = async () => {
		const data = await get(this.query);
		io?.emit(events.HOST_NEW_DATA, {
			type: this.type,
			data,
			passwordHash: globalConfig.passwordHash,
			mac: globalConfig.mac
		});
	};

	constructor(query: object, type: Data, timer: number) {
		this.query = query;
		this.type = type;
		this.timer = timer;

		this.interval = null;
		this.running = false;
	}

	configure(query: object, timer: number) {
		this.query = query;
		this.timer = timer;

		return this;
	}

	start() {
		if (this.timer) {
			this.emit();
			this.interval = setInterval(() => this.emit(), this.timer);
			this.running = true;
		}

		return this;
	}

	pause() {
		if (this.interval) clearInterval(this.interval);
		this.running = false;

		return this;
	}

	update(query?: object, timer?: number) {
		if (!query && !timer) return this;

		this.pause();
		this.configure(query ?? this?.query, timer ?? this.timer);
		this.start();

		return this;
	}

	kill() {
		this.pause();
		this.query = {};
		this.timer = 0;
		this.interval = null;
		this.running = false;

		return this;
	}
}

const scrapers: Record<Data, Scraper> = {
	cpu: new Scraper(
		{
			cpu: "manufacturer, brand, speed, speedMin, speedMax, cores, physicalCores, processors",
			cpuCurrentSpeed: "*",
			cpuTemperature: "*",
		},
		"cpu",
		DEFAULT_TIMER,
	),
	memory: new Scraper(
		{
			mem: "total, free, used, active, slab, available, swaptotal, swapused, swapfree",
		},
		"memory",
		DEFAULT_TIMER,
	),
	system: new Scraper(
		{
			osInfo: "platform, distro, kernel, hostname",
			users: "*",
		},
		"system",
		LONG_TIMER,
	),
	battery: new Scraper(
		{
			battery:
				"hasBattery, isCharging, maxCapacity, currentCapacity, percent, timeRemaining, voltage, manufacturer",
		},
		"battery",
		DEFAULT_TIMER,
	),
	process: new Scraper(
		{
			currentLoad:
				"avgLoad, currentLoad, currentLoadUser, currentLoadSystem, currentLoadNice, currentLoadIdle, currentLoadIrq, rawCurrentLoad, cpus",
			processes: "*",
		},
		"process",
		DEFAULT_TIMER,
	),
	network: new Scraper(
		{
			networkStats: "*",
			networkConnections: "*",
		},
		"network",
		DEFAULT_TIMER,
	),
	disk: new Scraper({ diskLayout: "*" }, "disk", LONG_TIMER),
};

const startScrapers = () => {
	for (const scraper of Object.values(scrapers)) {
		scraper.start();
	}
};

export { scrapers, startScrapers };
