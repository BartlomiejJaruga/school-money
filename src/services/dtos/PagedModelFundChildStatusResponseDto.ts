import type { ChildFundStatusType, SimpleDateString } from '@lib/constants';

export type PagedModelFundChildStatusResponseDto = {
  child: {
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
  status: ChildFundStatusType;
};
