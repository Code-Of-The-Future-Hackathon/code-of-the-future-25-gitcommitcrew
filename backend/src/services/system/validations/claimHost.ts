import { z } from "zod";

import { SystemErrors } from "@services/system/constants/errors";

import { createZodMessage } from "@utils/createZodMessage";

const claimHostValidation = z.object({
	password: z.string({ message: createZodMessage(SystemErrors.INVALID_DATA) }),
	hostId: z.string({ message: createZodMessage(SystemErrors.INVALID_DATA) }),
});

export type TClaimHost = z.infer<typeof claimHostValidation>;

export { claimHostValidation };
