import { object, string } from 'yup';

export const registrationSchema = object({
  firstName: string()
    .required('general.required')
    .max(40, 'user.firstNameTooLong'),
  lastName: string()
    .required('general.required')
    .max(40, 'user.lastNameTooLong'),
  email: string()
    .required('general.required')
    .email('general.invalidEmail')
    .lowercase('general.mustBeLowerCase'),
  password: string()
    .required('general.required')
    .min(8, 'user.passwordTooShort')
    .max(30, 'user.passwordTooLong')
    .matches(
      /((?=.*\d)|(?=.*\W))(?![\n.])(?=.*[A-Z])(?=.*[a-z]).*$/,
      'user.passwordTooWeak',
    ),
});
