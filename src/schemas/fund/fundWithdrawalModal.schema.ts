import { z } from 'zod';
import { WithdrawalNote, PositiveNumber } from '@schemas/common.schema';

export const FundWithdrawalModalSchema = z.object({
  note: WithdrawalNote,
  amount: PositiveNumber.min(1, "The amount can't be lower than 1 PLN"),
});

export type FundWithdrawalModalValues = z.infer<
  typeof FundWithdrawalModalSchema
>;
