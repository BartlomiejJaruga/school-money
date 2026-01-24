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
    return { ok: false, message: 'missing data for rejecting fund.' };
  }

  try {
    await axiosInstance.post(
      `/v1/children/${childId}/funds/ignored`,
      {},
      {
        params: {
          fundId: fundId,
        },
      }
    );

    return { ok: true, message: 'Fund rejected successfully.' };
  } catch (error) {
    console.error('Error', error);
    return { ok: false, message: 'Failed to reject fund.' };
  }
};

const FundRejectRoute: RouteObject = {
  id: 'fund-reject',
  path: '/fundReject',
  element: null,
  loader: loader,
  action: action,
};

export default FundRejectRoute;
