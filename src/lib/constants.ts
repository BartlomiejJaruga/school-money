// ======= Whole app constants are placed here =======

// helper for getting type of object values
type ValueOf<T> = T[keyof T];

// === CONSTANTS ===

export type AuthenticationPageAsideType = ValueOf<
  typeof AUTHENTICATION_PAGE_ASIDE_TYPE_ENUM
>;
export const AUTHENTICATION_PAGE_ASIDE_TYPE_ENUM = {
  Login: 'login',
  Register: 'register',
} as const;

export type SimpleDateString =
  `${number}${number}${number}${number}-${number}${number}-${number}${number}`;
