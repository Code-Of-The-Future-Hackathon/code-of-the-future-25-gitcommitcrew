import { config } from "@/index";
import { io } from "@/server/socket";
import { get } from "systeminformation";
import { events, type Data } from "@/../../events";
import { queries } from "@/scraper/queries";

const FAST_TIMER = 5 * 1000;
const DEFAULT_TIMER = 30 * 1000;

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
			passwordHash: config.passwordHash,
			mac: config.mac,
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
	cpu: new Scraper(queries.cpu, "cpu", FAST_TIMER),
	memory: new Scraper(queries.memory, "memory", FAST_TIMER),
	system: new Scraper(queries.system, "system", FAST_TIMER),
	battery: new Scraper(queries.battery, "battery", FAST_TIMER),
	process: new Scraper(queries.process, "process", FAST_TIMER),
	network: new Scraper(queries.network, "network", FAST_TIMER),
	disk: new Scraper(queries.disk, "disk", FAST_TIMER),
};

const startScrapers = () => {
	for (const scraper of Object.values(scrapers)) {
		scraper.start();
	}
};

export { scrapers, startScrapers, FAST_TIMER, DEFAULT_TIMER };
