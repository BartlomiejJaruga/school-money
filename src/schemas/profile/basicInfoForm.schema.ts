import { z } from 'zod';
import { FirstName, LastName, Email } from '@schemas/common.schema';

export const BasicInfoFormSchema = z.object({
  firstName: FirstName,
  lastName: LastName,
  emailAddress: Email,
});

export type BasicInfoFormValues = z.infer<typeof BasicInfoFormSchema>;
