import { z } from 'zod';
import { IBAN, PositiveNumber } from '@schemas/common.schema';

export const WalletWithdrawalModalSchema = z.object({
  iban: IBAN,
  amount: PositiveNumber.min(1, "The amount can't be lower than 1 PLN"),
});

export type WalletWithdrawalModalValues = z.infer<
  typeof WalletWithdrawalModalSchema
>;
