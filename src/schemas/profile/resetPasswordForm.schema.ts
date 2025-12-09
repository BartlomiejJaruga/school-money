import { z } from 'zod';
import {
  Password,
  RepeatPassword,
  checkFieldsEquality,
} from '@schemas/common.schema';

const ResetPasswordFormSchemaBase = z.object({
  currentPassword: Password,
  newPassword: Password,
  repeatNewPassword: RepeatPassword,
});

export const ResetPasswordFormSchema = checkFieldsEquality(
  ResetPasswordFormSchemaBase,
  'newPassword',
  'repeatNewPassword',
  "Passwords don't match."
);

export type ResetPasswordFormValues = z.infer<typeof ResetPasswordFormSchema>;
