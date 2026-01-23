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

  if (!fundId) {
    return { ok: false, message: 'missing data for completing cancel.' };
  }

  try {
    await axiosInstance.post(`/v1/funds/${fundId}/cancel`);

    return redirect('/created-funds');
  } catch (error) {
    console.error('Error', error);
    return { ok: false, message: 'Failed to cancel fund.' };
  }
};

const FundCancelRoute: RouteObject = {
  id: 'fund-cancel',
  path: '/fundCancel',
  element: null,
  loader: loader,
  action: action,
};

export default FundCancelRoute;
