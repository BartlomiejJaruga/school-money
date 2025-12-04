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

export type FUND_STATUS_TYPE = ValueOf<typeof FUND_STATUS_ENUM>;

export const FUND_STATUS_ENUM = {
  paid: 'Paid',
  cancelled: 'Cancelled',
  rejected: 'Rejected',
} as const;

export type FundDocumentsType = ValueOf<typeof FUND_DOCUMENTS_TYPE_ENUM>;

export const FUND_DOCUMENTS_TYPE_ENUM = {
  image: 'image',
  pdf: 'pdf',
  video: 'video',
  archive: 'archive',
} as const;
