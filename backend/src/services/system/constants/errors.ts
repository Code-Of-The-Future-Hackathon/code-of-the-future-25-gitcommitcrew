import { ServiceType } from "@common/constants/serviceType";
import { IAppError } from "@common/error/types";

enum SYSTEM_ERROR_KEYS {
	COULD_NOT_CREATE = "COULD_NOT_CREATE",
	NOT_FOUND = "NOT_FOUND",
	INVALID_DATA = "INVALID_DATA",
}

const SystemErrors: Record<SYSTEM_ERROR_KEYS, IAppError> = {
	[SYSTEM_ERROR_KEYS.COULD_NOT_CREATE]: {
		message_error: "The host could not be created.",
		status_code: 500,
		service: ServiceType.SYSTEM,
	},
	[SYSTEM_ERROR_KEYS.NOT_FOUND]: {
		message_error: "No host was found.",
		status_code: 400,
		service: ServiceType.SYSTEM,
	},
	[SYSTEM_ERROR_KEYS.INVALID_DATA]: {
		message_error: "Invalid data.",
		status_code: 400,
		service: ServiceType.SYSTEM,
	},
};

export { SystemErrors, SYSTEM_ERROR_KEYS };
