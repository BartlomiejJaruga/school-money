import type { PageableResponseDTO } from '@dtos/_PageableResponseDTO';
import type { PagedModelFinancialOperationResponseDto } from '@dtos/PagedModelFinancialOperationResponseDto';
import { getUserData } from '@lib/session';
import { PaymentHistoryPage } from '@pages/PaymentHistoryPage';
import axiosInstance from '@services/axiosInstance';
import {
  redirect,
  type LoaderFunction,
  type LoaderFunctionArgs,
  type RouteObject,
} from 'react-router-dom';

export type PaymentHistoryLoaderData = {
  financialHistoryData: PageableResponseDTO<PagedModelFinancialOperationResponseDto> | null;
};

export const loader: LoaderFunction = async ({
  request,
}: LoaderFunctionArgs) => {
  const userData = getUserData();
  if (!userData) return redirect('/');

  const [financialHistoryData] = await Promise.all([
    fetchParentFinantialHistory(request),
  ]);

  const paymentHistoryLoaderData: PaymentHistoryLoaderData = {
    financialHistoryData: financialHistoryData,
  };

  return paymentHistoryLoaderData;
};

const fetchParentFinantialHistory = async (
  request: Request
): Promise<PageableResponseDTO<PagedModelFinancialOperationResponseDto> | null> => {
  const url = new URL(request.url);
  const page = parseInt(
    url.searchParams.get('financialHistoryPage') || '0',
    10
  );

  try {
    const response = await axiosInstance.get(`/v1/parents/finances/history`, {
      params: {
        page: page,
        size: 10,
      },
    });

    return response.data ?? null;
  } catch (error) {
    console.error('Error', error);
    return null;
  }
};

const PaymentHistoryRoute: RouteObject = {
  path: '/payment-history',
  element: <PaymentHistoryPage />,
  loader: loader,
};

export default PaymentHistoryRoute;
