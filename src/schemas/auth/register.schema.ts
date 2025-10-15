import { z } from 'zod';
import {
  Email,
  Password,
  RepeatPassword,
  FirstName,
  LastName,
  checkFieldsEquality,
} from '@schemas/common.schema';

const RegisterSchemaBase = z.object({
  firstName: FirstName,
  lastName: LastName,
  email: Email,
  password: Password,
  repeatPassword: RepeatPassword,
});

export const RegisterSchema = checkFieldsEquality(
  RegisterSchemaBase,
  'password',
  'repeatPassword',
  "Passwords don't match"
);

export type RegisterValues = z.infer<typeof RegisterSchema>;
