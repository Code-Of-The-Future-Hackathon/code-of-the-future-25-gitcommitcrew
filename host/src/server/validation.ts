import z from "zod";
import type { Data } from "../../../events";

const operation = z.object({
	passwordHash: z.string(),
	data: z
		.string()
		.refine((data) =>
			[
				"cpu",
				"memory",
				"system",
				"battery",
				"network",
				"disk",
				"process",
			].includes(data),
		)
		.transform((data) => data as Data),
});

const updateTimer = z.object({
	passwordHash: z.string(),
	data: z
		.string()
		.refine((data) =>
			[
				"cpu",
				"memory",
				"system",
				"battery",
				"network",
				"disk",
				"process",
			].includes(data),
		)
		.transform((data) => data as Data),
	timer: z.number().min(100),
});

const updateQuery = z.object({
	passwordHash: z.string(),
	data: z
		.string()
		.refine((data) =>
			[
				"cpu",
				"memory",
				"system",
				"battery",
				"network",
				"disk",
				"process",
			].includes(data),
		)
		.transform((data) => data as Data),
	query: z.object({}).passthrough(),
});

export { updateQuery, updateTimer, operation };
