import { z } from 'zod';
import { FirstName, LastName, Birthday } from '@schemas/common.schema';

export const NewChildSchema = z.object({
  firstName: FirstName,
  lastName: LastName,
  birthday: Birthday,
  // can add Photo validation and requirement
});

export type NewChildValues = z.infer<typeof NewChildSchema>;
