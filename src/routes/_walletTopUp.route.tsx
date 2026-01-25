import { PAYMENT_PROVIDER_ENUM } from '@lib/constants';
import { getUserData } from '@lib/session';
import axiosInstance from '@services/axiosInstance';
import {
  redirect,
  type ActionFunction,
  type ActionFunctionArgs,
  type LoaderFunction,
  type RouteObject,
} from 'react-router-dom';

const loader: LoaderFunction = async () => {
  return redirect('/funds');
};

const action: ActionFunction = async ({ request }: ActionFunctionArgs) => {
  const userData = getUserData();
  if (!userData) return redirect('/');

  const formData = await request.formData();
  const amount = formData.get('amount') as string;
  const currentAppLocation = formData.get('currentAppLocation') as string;

  const amountInCents = parseInt(amount, 10) * 100;

  try {
    const response = await axiosInstance.post(`/v1/wallets/top-up`, {
      provider_type: PAYMENT_PROVIDER_ENUM.stripe,
      amount_in_cents: amountInCents,
      success_redirect_url: currentAppLocation,
      cancel_redirect_url: currentAppLocation,
    });

    return {
      ok: true,
      checkoutUrl: response.data.checkout_url,
      message: 'Money added to wallet successfully.',
    };
  } catch (error) {
    console.error('Error', error);
    return { ok: false, message: 'Failed to add money to wallet.' };
  }
};

const WalletTopUpRoute: RouteObject = {
  id: 'wallet-top-up',
  path: '/walletTopUp',
  element: null,
  loader: loader,
  action: action,
};

export default WalletTopUpRoute;
