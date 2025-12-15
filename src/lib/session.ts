import type { UserRoleType } from '@lib/constants';

// ====== TYPES AND KEYS ======

const USER_DATA_KEY = 'user-data';
export type UserData = {
  userId: string;
  role: UserRoleType;
  firstName: string;
  lastName: string;
};

const AUTH_DATA_KEY = 'auth-data';
export type AuthData = {
  accessToken: string;
  refreshToken: string;
};

// ====== SESSION FUNCTIONS ======

export function saveUserData(data: UserData): void {
  try {
    const serializedData = JSON.stringify(data);
    sessionStorage.setItem(USER_DATA_KEY, serializedData);
  } catch (error) {
    console.error('[sessionStorage] Error:', error);
  }
}

export function getUserData(): UserData | null {
  const serializedData = sessionStorage.getItem(USER_DATA_KEY);

  if (!serializedData) {
    return null;
  }

  try {
    return JSON.parse(serializedData) as UserData;
  } catch (error) {
    console.error('[sessionStorage] Error:', error);
    sessionStorage.removeItem(USER_DATA_KEY);
    return null;
  }
}

export function saveAuthData(data: AuthData): void {
  try {
    const serializedData = JSON.stringify(data);
    sessionStorage.setItem(AUTH_DATA_KEY, serializedData);
  } catch (error) {
    console.error('[sessionStorage] Error:', error);
  }
}

export function getAuthData(): AuthData | null {
  const serializedData = sessionStorage.getItem(AUTH_DATA_KEY);

  if (!serializedData) {
    return null;
  }

  try {
    return JSON.parse(serializedData) as AuthData;
  } catch (error) {
    console.error('[sessionStorage] Error:', error);
    sessionStorage.removeItem(AUTH_DATA_KEY);
    return null;
  }
}
