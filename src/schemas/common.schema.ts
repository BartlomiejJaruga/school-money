import { z, ZodObject, type ZodRawShape } from 'zod';
import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
  WITHDRAWAL_NOTE_MIN_LENGTH,
  WITHDRAWAL_NOTE_MAX_LENGTH,
  DEPOSIT_NOTE_MIN_LENGTH,
  DEPOSIT_NOTE_MAX_LENGTH,
} from '@lib/constants';

// consts

export const Email = z
  .string()
  .trim()
  .min(1, 'This field is required')
  .pipe(z.email({ message: 'Enter valid Email address' }));

export const Password = z
  .string()
  .refine((v) => !/\s/.test(v), "Password can't contain spaces")
  .min(1, 'This field is required')
  .min(
    PASSWORD_MIN_LENGTH,
    `Password can't be shorter than ${PASSWORD_MIN_LENGTH} characters`
  )
  .max(
    PASSWORD_MAX_LENGTH,
    `Password can't be longer than ${PASSWORD_MAX_LENGTH} characters`
  );

export const RepeatPassword = z
  .string()
  .trim()
  .min(1, 'This field is required')
  .min(
    PASSWORD_MIN_LENGTH,
    `Password can't be shorter than ${PASSWORD_MIN_LENGTH} characters`
  )
  .max(
    PASSWORD_MAX_LENGTH,
    `Password can't be longer than ${PASSWORD_MAX_LENGTH} characters`
  );

export const FirstName = z
  .string()
  .trim()
  .min(1, 'This field is required')
  .max(30, "First name can't be longer than 30 characters");

export const LastName = z
  .string()
  .trim()
  .min(1, 'This field is required')
  .max(30, "Last name can't be longer than 30 characters");

export const Birthday = z
  .string()
  .min(1, 'This field is required')
  .refine((val) => {
    const date = new Date(val);
    return !isNaN(date.getTime());
  }, 'Invalid date format')
  .refine((val) => {
    const date = new Date(val);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date <= today;
  }, "Birthday can't be a future date");

export const DateInput = z
  .string()
  .min(1, 'This field is required')
  .refine((val) => {
    const date = new Date(val);
    return !isNaN(date.getTime());
  }, 'Invalid date format');

export const FundTitle = z
  .string()
  .trim()
  .min(1, 'This field is required')
  .max(80, 'Title is too long');

export const FundDescription = z
  .string()
  .trim()
  .min(1, 'This field is required')
  .max(1000, 'Description is too long');

export const SchoolClassId = z.string().trim().min(1, 'This field is required');

export const PositiveNumber = z.number({ error: 'This field is required' });

export const InvitationCode = z
  .string()
  .trim()
  .regex(/^[A-Z0-9]{12}$/, 'Invalid code format')
  .optional()
  .or(z.literal(''));

export const WithdrawalNote = z
  .string()
  .trim()
  .min(1, 'This field is required')
  .min(WITHDRAWAL_NOTE_MIN_LENGTH, 'Note is too short')
  .max(WITHDRAWAL_NOTE_MAX_LENGTH, 'Note is too long');

export const DepositNote = z
  .string()
  .trim()
  .min(1, 'This field is required')
  .min(DEPOSIT_NOTE_MIN_LENGTH, 'Note is too short')
  .max(DEPOSIT_NOTE_MAX_LENGTH, 'Note is too long');

// functions

export function checkFieldsEquality<
  T extends ZodRawShape,
  L extends keyof z.infer<ZodObject<T>>,
  R extends keyof z.infer<ZodObject<T>>,
>(
  schemaBase: ZodObject<T>,
  left: L,
  right: R &
    (z.infer<ZodObject<T>>[L] extends z.infer<ZodObject<T>>[R]
      ? unknown
      : never),
  message: string = 'Fields differ'
) {
  return schemaBase.refine((data) => data[left] == data[right], {
    message,
    path: [right as string],
  });
}
