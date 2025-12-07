import type { FundOperationType, SimpleDateString } from '@lib/constants';

export type FundOperationResponseDTO = {
  fundOperationId: string;
  amountInCents: number;
  currency: string;
  operationType: FundOperationType;
  date: SimpleDateString;
};
