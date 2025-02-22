import { ServiceType } from '@common/constants/serviceType';
import { IAppError } from '@common/error/types';

enum USER_ERROR_KEYS {
  COULD_NOT_CREATE = 'COULD_NOT_CREATE',
  NOT_FOUND = 'NOT_FOUND',
}

const UserErrors: Record<USER_ERROR_KEYS, IAppError> = {
  [USER_ERROR_KEYS.COULD_NOT_CREATE]: {
    message_error: 'The user could not be created.',
    status_code: 500,
    service: ServiceType.USER,
  },
  [USER_ERROR_KEYS.NOT_FOUND]: {
    message_error: 'No user was found.',
    status_code: 400,
    service: ServiceType.USER,
  },
};

export { UserErrors, USER_ERROR_KEYS };
