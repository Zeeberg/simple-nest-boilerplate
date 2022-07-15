import { object, string } from 'yup';

export const authorizationSchema = object({
  email: string().required('general.required'),
  password: string().required('general.required'),
});
