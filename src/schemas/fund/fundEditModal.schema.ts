import { z } from 'zod';
import { FundTitle, FundDescription } from '@schemas/common.schema';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const FundEditModalSchema = z.object({
  title: FundTitle,
  description: FundDescription,
  logoFile: z
    .instanceof(File, { message: 'Select valid file' })
    .refine((file) => file.size <= MAX_FILE_SIZE, 'Max size of file is 5MB')
    .optional()
    .or(z.null()),
});

export type FundEditModalValues = z.infer<typeof FundEditModalSchema>;
