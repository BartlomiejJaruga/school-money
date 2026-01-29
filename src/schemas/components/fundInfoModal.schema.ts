import { z } from 'zod';
import {
  FundTitle,
  FundDescription,
  DateInput,
  PositiveNumber,
  SchoolClassId,
} from '@schemas/common.schema';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const FundInfoModalSchema = z.object({
  title: FundTitle,
  description: FundDescription,
  schoolClassId: SchoolClassId,
  startDate: DateInput,
  endDate: DateInput,
  costPerChild: PositiveNumber.min(1, "The cost can't be lower than 1 PLN").max(
    10000,
    "The cost can't be higher than 10000 PLN"
  ),
  logoFile: z
    .instanceof(File, { message: 'Select valid file' })
    .refine((file) => file.size <= MAX_FILE_SIZE, 'Max size of file is 5MB')
    .optional()
    .or(z.null()),
});

export type FundInfoModalValues = z.infer<typeof FundInfoModalSchema>;
