import { object, string } from 'yup';

export const userInfoSchema = object({
  first_name: string()
    .required('general.required')
    .max(40, 'user.firstNameTooLong'),
  last_name: string()
    .required('general.required')
    .max(40, 'user.lastNameTooLong'),
  email: string() // check for empty string
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
