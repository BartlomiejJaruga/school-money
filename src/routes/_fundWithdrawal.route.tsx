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
  const amount = formData.get('amount') as string;
  const note = formData.get('note') as string;

  const amountInCents = parseInt(amount, 10) * 100;

  try {
    await axiosInstance.post(`/v1/funds/${fundId}/withdraw`, {
      amount_in_cents: amountInCents,
      note: note,
    });

    return { ok: true, message: 'Money withdrawn successfully.' };
  } catch (error) {
    console.error('Error', error);
    return { ok: false, message: 'Failed to withdraw money.' };
  }
};

const FundWithdrawalRoute: RouteObject = {
  id: 'fund-withdrawal',
  path: '/fundWithdrawal',
  element: null,
  loader: loader,
  action: action,
};

export default FundWithdrawalRoute;
