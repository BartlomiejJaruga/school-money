import type {
  FUND_PAYMENT_STATUS_TYPE,
  FUND_STATUS_TYPE,
  SimpleDateString,
} from '@lib/constants';

export type PagedModelParentChildUnpaidFundResponseDto = {
  child: {
    child_id: string;
    first_name: string;
    last_name: string;
    birth_date: SimpleDateString;
  };
  child_status: FUND_PAYMENT_STATUS_TYPE;
  fund: {
    fund_id: string;
    author_id: string;
    school_class: {
      school_class_id: string;
      school_class_name: string;
      school_class_year: string;
    };
    title: string;
    description: string;
    starts_at: string;
    ends_at: string;
    amount_per_child_in_cents: number;
    iban: string;
    fund_status: FUND_STATUS_TYPE;
    fund_progress: {
      progress_percentage: number;
      current_amount_in_cents: number;
      target_amount_in_cents: number;
      remaining_amount_in_cents: number;
      participating_children_count: number;
      paid_children_count: number;
      unpaid_children_count: number;
      ignored_children_count: number;
    };
  };
};
