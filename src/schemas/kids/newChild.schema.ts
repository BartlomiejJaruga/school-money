import { z } from 'zod';
import { FirstName, LastName, Birthday } from '@schemas/common.schema';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const NewChildSchema = z.object({
  firstName: FirstName,
  lastName: LastName,
  birthday: Birthday,
  avatarFile: z
    .instanceof(File, { message: 'Select valid file' })
    .refine((file) => file.size <= MAX_FILE_SIZE, 'Max size of file is 5MB')
    .optional()
    .or(z.null()),
});

export type NewChildValues = z.infer<typeof NewChildSchema>;
