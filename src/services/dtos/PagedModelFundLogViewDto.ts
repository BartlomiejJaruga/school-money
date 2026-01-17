import type { FundOperationType } from '@lib/constants';

export type PagedModelFundLogViewDto = {
  amount_in_cents: number;
  operation_type: FundOperationType;
  operation_status: string;
  fund_title: string;
  parent_full_name: string;
  child_full_name: string;
  note: string;
  currency: string;
  timestamp: string; // ISO 8601
};
