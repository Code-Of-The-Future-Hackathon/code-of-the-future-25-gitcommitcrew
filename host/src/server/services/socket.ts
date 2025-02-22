import type { Data } from "../../../../events";

const customData: Record<Data, number> = {
	cpu: 5 * 1000,
	disk: 5 * 1000,
	memory: 5 * 1000,
	network: 5 * 1000,
	process: 5 * 1000,
	system: 5 * 1000,
};

const changeIntervalSpeed = (data: Data, interval: number) => {
	customData[data] = interval;
};

export { changeIntervalSpeed };
