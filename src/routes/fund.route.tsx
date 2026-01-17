import type { PageableResponseDTO } from '@dtos/_PageableResponseDTO';
import type { FundResponseDTO } from '@dtos/FundResponseDto';
import type { PagedModelFundChildStatusResponseDto } from '@dtos/PagedModelFundChildStatusResponseDto';
import { FundPage } from '@pages/FundPage';
import axiosInstance from '@services/axiosInstance';
import type {
  LoaderFunction,
  LoaderFunctionArgs,
  RouteObject,
} from 'react-router-dom';

export type FundLoaderData = {
  fundChildrenStatuses: PageableResponseDTO<PagedModelFundChildStatusResponseDto> | null;
  fundData: FundResponseDTO | null;
};

export const loader: LoaderFunction = async ({
  params,
  request,
}: LoaderFunctionArgs) => {
  const fundId = params.fundId ?? null;

  const [fundChildrenStatuses, fundData] = await Promise.all([
    fetchFundChildrenStatuses(fundId, request),
    fetchFundData(fundId),
  ]);

  const fundLoaderData: FundLoaderData = {
    fundChildrenStatuses: fundChildrenStatuses,
    fundData: fundData,
  };

  return fundLoaderData;
};

const fetchFundData = async (
  fundId: string | null
): Promise<FundResponseDTO | null> => {
  if (!fundId) return null;

  try {
    const response = await axiosInstance.get(`/v1/funds/${fundId}`);

    return response.data ?? null;
  } catch (error) {
    console.error('Error', error);
    return null;
  }
};

const fetchFundChildrenStatuses = async (
  fundId: string | null,
  request: Request
): Promise<PageableResponseDTO<PagedModelFundChildStatusResponseDto> | null> => {
  if (!fundId) return null;

  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('childrenStatusPage') || '0', 10);

  try {
    const response = await axiosInstance.get(
      `/v1/funds/${fundId}/children/statuses`,
      {
        params: {
          page: page,
          size: 10,
          sort: 'lastName,firstName,birthDate,ASC',
        },
      }
    );

    return response.data ?? null;
  } catch (error) {
    console.error('Error', error);
    return null;
  }
};

const FundRoute: RouteObject = {
  path: '/funds/:fundId',
  element: <FundPage />,
  loader: loader,
};

export default FundRoute;
