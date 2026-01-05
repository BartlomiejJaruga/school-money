import type { SimpleDateString } from '@lib/constants';

export type ChildWithParentInfoResponseDto = {
  child_id: string;
  parent: {
    user_id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  first_name: string;
  last_name: string;
  birth_date: SimpleDateString;
};
