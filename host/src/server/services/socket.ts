import { globalConfig } from "@/index";
import type { Data } from "../../../../events";
import { scrapers } from "../../../scraper";

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

export { changeIntervalSpeed };
