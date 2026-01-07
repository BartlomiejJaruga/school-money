import type { FundResponseDTO } from '@dtos/FundResponseDto';
import { getUserData } from '@lib/session';
import { FundsPage } from '@pages/FundsPage';
import axiosInstance from '@services/axiosInstance';
import {
  redirect,
  type LoaderFunction,
  type RouteObject,
} from 'react-router-dom';

export type FundsLoaderData = {
  funds: FundResponseDTO[] | null;
};

export const loader: LoaderFunction = async () => {
  const userData = getUserData();
  if (!userData) return redirect('/');

  const funds = await fetchAllChildrenFunds();

  const fundsLoaderData: FundsLoaderData = {
    funds: funds,
  };

  return fundsLoaderData;
};

const fetchAllChildrenFunds = async (): Promise<FundResponseDTO[] | null> => {
  try {
    const response = await axiosInstance.get('/v1/parents/children/funds', {
      params: {
        page: 0,
        size: 50,
        sort: 'endsAt,ASC',
      },
    });

    return response.data?.content ?? null;
  } catch (error) {
    console.error('Error', error);
    return null;
  }
};

const FundsRoute: RouteObject = {
  path: '/funds',
  element: <FundsPage />,
  loader: loader,
};

export default FundsRoute;
