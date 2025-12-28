export type SchoolClassResponseDto = {
  school_class_id: string;
  treasurer: {
    user_id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  invitation_code: string;
  school_class_name: string;
  school_class_year: string;
  number_of_children: number;
  number_of_active_funds: number;
};
