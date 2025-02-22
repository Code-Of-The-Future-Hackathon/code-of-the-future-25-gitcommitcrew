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
	data: z
		.array(
			z.enum([
				"cpu",
				"memory",
				"system",
				"battery",
				"network",
				"disk",
				"process",
			]),
		)
		.min(1),
	isFast: z.boolean(),
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
