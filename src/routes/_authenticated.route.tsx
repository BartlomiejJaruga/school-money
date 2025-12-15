import type { WalletData } from '@lib/constants';
import { getUserData } from '@lib/session';
import axiosInstance from '@services/axiosInstance';
import { redirect, type LoaderFunction } from 'react-router-dom';

export type AsideLayoutData = {
  walletData: WalletData | null;
};

export const loader: LoaderFunction = async () => {
  const userData = getUserData();
  if (!userData) return redirect('/');

  const walletData: WalletData | null = await fetchWallet();

  const asideLayoutData: AsideLayoutData = {
    walletData: walletData,
  };

  return asideLayoutData;
};

const fetchWallet = async (): Promise<WalletData | null> => {
  try {
    const response = await axiosInstance.get('/v1/wallets/balance');
    console.log(response);

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
