import { z } from 'zod';
import { PositiveNumber } from '@schemas/common.schema';

export const WalletTopUpModalSchema = z.object({
  amount: PositiveNumber.min(1, "The amount can't be lower than 1 PLN"),
});

export type WalletTopUpModalValues = z.infer<typeof WalletTopUpModalSchema>;
