import type { PageableResponseDTO } from '@dtos/_PageableResponseDTO';
import type { PagedModelParentChildHistoryFundResponseDto } from '@dtos/PagedModelParentChildHistoryFundResponseDto';
import type { PagedModelParentChildUnpaidFundResponseDto } from '@dtos/PagedModelParentChildUnpaidFundResponseDto';
import { getUserData } from '@lib/session';
import { FundsPage } from '@pages/FundsPage';
import axiosInstance from '@services/axiosInstance';
import {
  redirect,
  type LoaderFunction,
  type LoaderFunctionArgs,
  type RouteObject,
} from 'react-router-dom';

export type FundsLoaderData = {
  funds: PageableResponseDTO<PagedModelParentChildUnpaidFundResponseDto> | null;
  historicalFunds: PageableResponseDTO<PagedModelParentChildHistoryFundResponseDto> | null;
};

export const loader: LoaderFunction = async ({
  request,
}: LoaderFunctionArgs) => {
  const userData = getUserData();
  if (!userData) return redirect('/');

  const [funds, historicalFunds] = await Promise.all([
    fetchUnpaidChildrenFunds(request),
    fetchHistoricalChildrenFunds(request),
  ]);

  const fundsLoaderData: FundsLoaderData = {
    funds: funds,
    historicalFunds: historicalFunds,
  };

  return fundsLoaderData;
};

const fetchUnpaidChildrenFunds = async (
  request: Request
): Promise<PageableResponseDTO<PagedModelParentChildUnpaidFundResponseDto> | null> => {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('fundsPage') || '0', 10);

  try {
    const response = await axiosInstance.get(
      `/v1/school-classes/funds/unpaid`,
      {
        params: {
          page: page,
          size: 3,
        },
      }
    );

    return response.data ?? null;
  } catch (error) {
    console.error('Error', error);
    return null;
  }
};

const fetchHistoricalChildrenFunds = async (
  request: Request
): Promise<PageableResponseDTO<PagedModelParentChildHistoryFundResponseDto> | null> => {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('historicalFundsPage') || '0', 10);

  try {
    const response = await axiosInstance.get(
      `/v1/school-classes/funds/history`,
      {
        params: {
          page: page,
          size: 5,
        },
      }
    );

    return response.data ?? null;
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
