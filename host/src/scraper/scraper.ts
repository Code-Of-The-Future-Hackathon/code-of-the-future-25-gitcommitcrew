import { get } from "systeminformation";
import { io } from "@/server/config/socket";
import { events, type Data } from "../../../events";
import { globalConfig } from "../../src";
import { queries } from "./queries";

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

	stop() {
		if (this.interval) clearInterval(this.interval);
		this.running = false;

		return this;
	}

	update(query?: object, timer?: number) {
		if (!query && !timer) return this;

		this.stop();
		this.configure(query ?? this?.query, timer ?? this.timer);
		this.start();

		return this;
	}

	terminate() {
		this.stop();
		this.query = {};
		this.timer = 0;
		this.interval = null;
		this.running = false;

		return this;
	}
}

const scrapers: Record<Data, Scraper> = {
	cpu: new Scraper(
		queries.cpu,
		"cpu",
		DEFAULT_TIMER,
	),
	memory: new Scraper(
		queries.memory,
		"memory",
		DEFAULT_TIMER,
	),
	system: new Scraper(
		queries.system,
		"system",
		LONG_TIMER,
	),
	battery: new Scraper(
		queries.battery,
		"battery",
		DEFAULT_TIMER,
	),
	process: new Scraper(
		queries.process,
		"process",
		DEFAULT_TIMER,
	),
	network: new Scraper(
		queries.network,
		"network",
		DEFAULT_TIMER,
	),
	disk: new Scraper(queries.disk, "disk", LONG_TIMER),
};

const startScrapers = () => {
	for (const scraper of Object.values(scrapers)) {
		scraper.start();
	}
};

export { scrapers, startScrapers };
