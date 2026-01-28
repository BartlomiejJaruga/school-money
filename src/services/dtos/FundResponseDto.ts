import type { FundStatusType } from '@lib/constants';

export type FundResponseDTO = {
  fund_id: string;
  author_id: string;
  school_class: {
    school_class_id: string;
    school_class_name: string;
    school_class_year: string;
  };
  title: string;
  description: string;
  created_at: string; // ISO 8601
  starts_at: string; // ISO 8601
  ends_at: string; // ISO 8601
  ended_at: string; // ISO 8601
  amount_per_child_in_cents: number;
  iban: string;
  fund_status: FundStatusType;
  fund_current_balance_in_cents: number;
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
