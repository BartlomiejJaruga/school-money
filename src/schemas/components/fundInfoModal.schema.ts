import { z } from 'zod';
import {
  FundTitle,
  FundDescription,
  DateInput,
  PositiveNumber,
} from '@schemas/common.schema';

export const FundInfoModalSchema = z.object({
  title: FundTitle,
  description: FundDescription,
  startDate: DateInput,
  endDate: DateInput,
  costPerChild: PositiveNumber.min(1, "The cost can't be lower than 1 PLN").max(
    10000,
    "The cost can't be higher than 10000 PLN"
  ),
});

export type FundInfoModalValues = z.infer<typeof FundInfoModalSchema>;
