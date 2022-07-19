import { number, object, string } from 'yup';

import { orderDir, orderFields } from '../../constants';

export const getUsersSchema = object({
  take: number()
    .min(1, 'user.tooLittleUsersToGet')
    .max(100, 'user.tooMuchUsersToGet'),
  skip: number(),
  orderBy: string().oneOf(orderFields),
  orderDir: string().oneOf(orderDir),
});
