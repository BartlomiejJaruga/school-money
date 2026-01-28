// ======= Whole app constants are placed here =======

// helper for getting type of object values
type ValueOf<T> = T[keyof T];

// === CONSTANTS ===

export const SUCCESSFUL_WALLET_TOP_UP_REDIRECT_URL = 'https://for/future/use';
export const CANCELLED_WALLET_TOP_UP_REDIRECT_URL = 'https://for/future/use';

export const PASSWORD_MIN_LENGTH = 4;
export const PASSWORD_MAX_LENGTH = 20;

export const WITHDRAWAL_NOTE_MIN_LENGTH = 1;
export const WITHDRAWAL_NOTE_MAX_LENGTH = 250;
export const DEPOSIT_NOTE_MIN_LENGTH = 1;
export const DEPOSIT_NOTE_MAX_LENGTH = 250;

// === ENUMS AND TYPES ===

export type AuthenticationPageAsideType = ValueOf<
  typeof AUTHENTICATION_PAGE_ASIDE_TYPE_ENUM
>;
export const AUTHENTICATION_PAGE_ASIDE_TYPE_ENUM = {
  Login: 'login',
  Register: 'register',
} as const;

export type SimpleDateString =
  `${number}${number}${number}${number}-${number}${number}-${number}${number}`;

export type FUND_PAYMENT_STATUS_TYPE = ValueOf<typeof FUND_PAYMENT_STATUS_ENUM>;

export const FUND_PAYMENT_STATUS_ENUM = {
  paid: 'PAID',
  unpaid: 'UNPAID',
  rejected: 'IGNORED',
  unknown: 'UNKNOWN',
} as const;

export type FundStatusType = ValueOf<typeof FUND_STATUS_ENUM>;

export const FUND_STATUS_ENUM = {
  scheduled: 'SCHEDULED',
  active: 'ACTIVE',
  finished: 'FINISHED',
  blocked: 'BLOCKED',
  cancelled: 'CANCELLED',
} as const;

export type FundDocumentsType = ValueOf<typeof FUND_DOCUMENTS_TYPE_ENUM>;

export const FUND_DOCUMENTS_TYPE_ENUM = {
  image: 'image',
  pdf: 'pdf',
  video: 'video',
  archive: 'archive',
} as const;

export type FundOperationType = ValueOf<typeof FUND_OPERATION_TYPE_ENUM>;

export const FUND_OPERATION_TYPE_ENUM = {
  payment: 'FUND_PAYMENT',
  rejection: 'FUND_REJECTION',
  refund: 'FUND_REFUND',
  deposit: 'FUND_DEPOSIT',
  withdrawal: 'FUND_WITHDRAWAL',
} as const;

export type ChildFundStatusType = ValueOf<typeof CHILD_FUND_STATUS_ENUM>;

export const CHILD_FUND_STATUS_ENUM = {
  paid: 'PAID',
  unpaid: 'UNPAID',
  declined: 'DECLINED',
} as const;

export type PaymentHistoryOperationType = ValueOf<
  typeof PAYMENT_HISTORY_OPERATION_TYPE_ENUM
>;

export const PAYMENT_HISTORY_OPERATION_TYPE_ENUM = {
  welcomeBonus: 'WELCOME_BONUS',
  walletTopUp: 'WALLET_TOP_UP',
  walletWithdrawal: 'WALLET_WITHDRAWAL',
  fundPayment: 'FUND_PAYMENT',
  fundRefund: 'FUND_REFUND',
  fundDeposit: 'FUND_DEPOSIT',
  fundWithdrawal: 'FUND_WITHDRAWAL',
} as const;

export type PaymentHistoryOperationStatusType = ValueOf<
  typeof PAYMENT_HISTORY_OPERATION_STATUS_ENUM
>;

export const PAYMENT_HISTORY_OPERATION_STATUS_ENUM = {
  success: 'SUCCESS',
  fail: 'FAIL',
  pending: 'PENDING',
  expired: 'EXPIRED',
} as const;

export const PROFILE_FORM_TYPE_ENUM = {
  basicInfoForm: 'BASIC_INFO_FORM',
  changePasswordForm: 'CHANGE_PASSWORD_FORM',
  updateAvatar: 'UPDATE_AVATAR',
} as const;

export type UserRoleType = ValueOf<typeof USER_ROLE_ENUM>;

export const USER_ROLE_ENUM = {
  parent: 'PARENT',
  schoolAdmin: 'SCHOOL_ADMIN',
  superAdmin: 'SUPER_ADMIN',
} as const;

export type WalletData = {
  currency: string;
  balanceInCents: number;
};

export type ChildDataSchoolClassData = {
  id: string;
  name: string;
  year: string;
};

export type ChildData = {
  id: string;
  schoolClass: ChildDataSchoolClassData;
  firstName: string;
  lastName: string;
  birthday: SimpleDateString;
};

export type SimpleChildData = {
  id: string;
  firstName: string;
  lastName: string;
};

export type PaymentProviderType = ValueOf<typeof PAYMENT_PROVIDER_ENUM>;

export const PAYMENT_PROVIDER_ENUM = {
  stripe: 'STRIPE',
  internal: 'INTERNAL',
} as const;
