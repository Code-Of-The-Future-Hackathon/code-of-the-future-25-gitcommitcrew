import { z } from "zod";

import { SystemErrors } from "@services/system/constants/errors";

import { createZodMessage } from "@utils/createZodMessage";

const getLatestDataValidation = z.object({
	hostId: z.string({ message: createZodMessage(SystemErrors.INVALID_DATA) }),
	types: z
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
			{ message: createZodMessage(SystemErrors.INVALID_DATA) },
		)
		.min(1, { message: createZodMessage(SystemErrors.INVALID_DATA) })
		.optional(),
});

export type TGetLatestData = z.infer<typeof getLatestDataValidation>;

export { getLatestDataValidation };
