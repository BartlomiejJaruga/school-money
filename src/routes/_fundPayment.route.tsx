import type { WalletData } from '@lib/constants';
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
  const fundId = formData.get('fundId') as string;
  const childId = formData.get('childId') as string;

  if (!fundId || !childId) {
    return { ok: false, message: 'missing data for completing payment.' };
  }

  try {
    const walletData = await fetchWallet();
    if (!walletData)
      return { ok: false, message: 'failed to fetch current wallet balance.' };

    await axiosInstance.post(
      `/v1/funds/${fundId}/pay`,
      {},
      {
        params: {
          childId: childId,
        },
      }
    );

    return { ok: true, message: 'Fund paid successfully.' };
  } catch (error) {
    console.error('Error', error);
    return { ok: false, message: 'Failed to paid fund.' };
  }
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

const FundPaymentRoute: RouteObject = {
  id: 'fund-payment',
  path: '/fundPayment',
  element: null,
  loader: loader,
  action: action,
};

export default FundPaymentRoute;
