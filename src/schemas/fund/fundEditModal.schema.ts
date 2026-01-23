import { z } from 'zod';
import { FundTitle, FundDescription } from '@schemas/common.schema';

export const FundEditModalSchema = z.object({
  title: FundTitle,
  description: FundDescription,
});

export type FundEditModalValues = z.infer<typeof FundEditModalSchema>;
