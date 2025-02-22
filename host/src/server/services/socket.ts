import { globalConfig } from "@/index";
import type { Data } from "../../../../events";
import { scrapers } from "@/scraper/scraper";

const startScraper = async (
	passwordHash: string,
	data: Data,
) => {
	if (!(await Bun.password.verify(globalConfig.password, passwordHash))) return;
	const scraper = scrapers[data];
	if (!scraper) return;

	scraper.start();
}

const stopScraper = async (
	passwordHash: string,
	data: Data,
) => {
	if (!(await Bun.password.verify(globalConfig.password, passwordHash))) return;
	const scraper = scrapers[data];
	if (!scraper) return;

	scraper.stop();
}

const terminateScraper = async (
	passwordHash: string,
	data: Data,
) => {
	if (!(await Bun.password.verify(globalConfig.password, passwordHash))) return;
	const scraper = scrapers[data];
	if (!scraper) return;

	scraper.terminate();
}

const changeIntervalSpeed = async (
	passwordHash: string,
	data: Data,
	interval: number,
) => {
	if (!(await Bun.password.verify(globalConfig.password, passwordHash))) return;
	const scraper = scrapers[data];
	if (!scraper) return;

	scraper.update(undefined, interval);
};

const changeQuery = async (
	passwordHash: string,
	data: Data,
	query: object,
) => {
	if (!(await Bun.password.verify(globalConfig.password, passwordHash))) return;
	const scraper = scrapers[data];
	if (!scraper) return;

	scraper.update(query, undefined);
}

export { changeQuery, changeIntervalSpeed, stopScraper, startScraper, terminateScraper };
