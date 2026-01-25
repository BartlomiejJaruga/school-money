import type { SimpleDateString } from '@lib/constants';

export type ChildWithSchoolClassInfoResponseDto = {
  child_id: string;
  school_class: {
    school_class_id: string;
    school_class_name: string;
    school_class_year: string;
  };
  first_name: string;
  last_name: string;
  birth_date: SimpleDateString;
};
