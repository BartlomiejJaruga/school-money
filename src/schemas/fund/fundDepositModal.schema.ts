import { z } from 'zod';
import { DepositNote, PositiveNumber } from '@schemas/common.schema';

export const FundDepositModalSchema = z.object({
  note: DepositNote,
  amount: PositiveNumber.min(1, "The amount can't be lower than 1 PLN"),
});

export type FundDepositModalValues = z.infer<typeof FundDepositModalSchema>;
