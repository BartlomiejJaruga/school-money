import { z, ZodObject, type ZodRawShape } from 'zod';

export const Email = z
  .string()
  .trim()
  .min(1, 'This field is required')
  .pipe(z.email({ message: 'Enter valid Email address' }));

export const Password = z
  .string()
  .refine((v) => !/\s/.test(v), "Password can't contain spaces")
  .min(1, 'This field is required');

export const RepeatPassword = z
  .string()
  .trim()
  .min(1, 'This field is required');

export const FirstName = z.string().trim().min(1, 'This field is required');

export const LastName = z.string().trim().min(1, 'This field is required');

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
