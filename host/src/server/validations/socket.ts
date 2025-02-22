import z from "zod";
import type { Data } from "../../../../events";

const operationValidation = z.object({
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
})

const updateIntervalSpeedValidation = z.object({
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

const updateQueryValidation = z.object({
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
	query: z.object({}).passthrough()
});

export { updateIntervalSpeedValidation, updateQueryValidation, operationValidation };
