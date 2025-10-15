import { z } from 'zod';
import { Email, Password } from '@schemas/common.schema';

export const LoginSchema = z.object({
  email: Email,
  password: Password,
});

export type LoginValues = z.infer<typeof LoginSchema>;
