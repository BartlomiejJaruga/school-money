import { z } from 'zod';

export const NewClassSchema = z.object({
  schoolClassName: z.string().trim().min(1, 'This field is required'),
  schoolClassYear: z
    .string()
    .trim()
    .min(1, 'This field is required')
    .regex(
      /^(\d{2}\/\d{2}|\d{4}\/\d{4})$/,
      'Invalid format. Use "YY/YY" or "YYYY/YYYY"'
    ),
});

export type NewClassValues = z.infer<typeof NewClassSchema>;
