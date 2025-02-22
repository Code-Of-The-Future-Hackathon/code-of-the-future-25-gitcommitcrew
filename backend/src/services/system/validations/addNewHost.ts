import { z } from "zod";

import { SystemErrors } from "@services/system/constants/errors";

import { createZodMessage } from "@utils/createZodMessage";

const addNewHostValidation = z.object({
	ip: z.string({ message: createZodMessage(SystemErrors.INVALID_DATA) }),
	passwordHash: z.string({
		message: createZodMessage(SystemErrors.INVALID_DATA),
	}),
	mac: z.string({ message: createZodMessage(SystemErrors.INVALID_DATA) }),
	hostname: z.string({ message: createZodMessage(SystemErrors.INVALID_DATA) }),
	org: z.string({ message: createZodMessage(SystemErrors.INVALID_DATA) }),
	port: z.number({ message: createZodMessage(SystemErrors.INVALID_DATA) }),
});

export type TNewHost = z.infer<typeof addNewHostValidation>;

export { addNewHostValidation };
