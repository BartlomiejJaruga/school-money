import type { WalletData } from '@lib/constants';
import { getUserData } from '@lib/session';
import axiosInstance from '@services/axiosInstance';
import { redirect, type LoaderFunction } from 'react-router-dom';

export type AsideLayoutData = {
  walletData: WalletData | null;
  userAvatar: Blob | null;
};

export const loader: LoaderFunction = async () => {
  const userData = getUserData();
  if (!userData) return redirect('/');

  const walletData = await fetchWallet();
  const userAvatar = await fetchUserAvatar(userData.userId);

  const asideLayoutData: AsideLayoutData = {
    walletData: walletData,
    userAvatar: userAvatar,
  };

  return asideLayoutData;
};

const fetchWallet = async (): Promise<WalletData | null> => {
  try {
    const response = await axiosInstance.get('/v1/wallets/balance');

    const walletData: WalletData = {
      currency: response.data.currency,
      balanceInCents: response.data.balance_in_cents,
    };

    return walletData;
  } catch (error) {
    console.error('Error', error);
    return null;
  }
};

const fetchUserAvatar = async (userId: string): Promise<Blob | null> => {
  if (!userId) return null;

  try {
    const response = await axiosInstance.get(`/v1/parents/${userId}/avatar`, {
      responseType: 'blob',
    });

    if (response.data?.size == 0) return null;

    return response.data;
  } catch (error) {
    console.error('Error', error);
    return null;
  }
};
