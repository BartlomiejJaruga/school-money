import type {
  PaymentHistoryOperationStatusType,
  PaymentHistoryOperationType,
} from '@lib/constants';

export type PagedModelFinancialOperationResponseDto = {
  started_at: string; // ISO 8601
  processed_at: string; // ISO 8601
  amount_in_cents: number;
  operation_status: PaymentHistoryOperationStatusType;
  operation_type: PaymentHistoryOperationType;
};
