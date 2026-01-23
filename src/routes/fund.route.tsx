import type { PageableResponseDTO } from '@dtos/_PageableResponseDTO';
import type { FundResponseDTO } from '@dtos/FundResponseDto';
import type { PagedModelFundChildStatusResponseDto } from '@dtos/PagedModelFundChildStatusResponseDto';
import type { PagedModelFundLogViewDto } from '@dtos/PagedModelFundLogViewDto';
import type { SchoolClassResponseDto } from '@dtos/SchoolClassResponseDto';
import { FundPage } from '@pages/FundPage';
import axiosInstance from '@services/axiosInstance';
import type {
  ActionFunction,
  ActionFunctionArgs,
  LoaderFunction,
  LoaderFunctionArgs,
  RouteObject,
} from 'react-router-dom';

export type FundLoaderData = {
  fundChildrenStatuses: PageableResponseDTO<PagedModelFundChildStatusResponseDto> | null;
  fundData: FundResponseDTO | null;
  fundLogs: PageableResponseDTO<PagedModelFundLogViewDto> | null;
  schoolClassData: SchoolClassResponseDto | null;
};

export const loader: LoaderFunction = async ({
  params,
  request,
}: LoaderFunctionArgs) => {
  const fundId = params.fundId ?? null;

  const [fundChildrenStatuses, fundData, fundLogs] = await Promise.all([
    fetchFundChildrenStatuses(fundId, request),
    fetchFundData(fundId),
    fetchFundLogs(fundId, request),
  ]);
  const schoolClassData = await fetchSchoolClassData(
    fundData?.school_class?.school_class_id ?? null
  );

  const fundLoaderData: FundLoaderData = {
    fundChildrenStatuses: fundChildrenStatuses,
    fundData: fundData,
    fundLogs: fundLogs,
    schoolClassData: schoolClassData,
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

const fetchFundLogs = async (
  fundId: string | null,
  request: Request
): Promise<PageableResponseDTO<PagedModelFundLogViewDto> | null> => {
  if (!fundId) return null;

  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('logsPage') || '0', 10);

  try {
    const response = await axiosInstance.get(`/v1/funds/${fundId}/logs`, {
      params: {
        page: page,
        size: 8,
      },
    });

    return response.data ?? null;
  } catch (error) {
    console.error('Error', error);
    return null;
  }
};

const fetchSchoolClassData = async (
  schoolClassId: string | null
): Promise<SchoolClassResponseDto | null> => {
  if (!schoolClassId) return null;

  try {
    const response = await axiosInstance.get(
      `/v1/school-classes/${schoolClassId}`
    );

    return response.data ?? null;
  } catch (error) {
    console.error('Error', error);
    return null;
  }
};

const action: ActionFunction = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();

  const fundId = formData.get('fundId') as string;
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;

  try {
    await axiosInstance.patch(`/v1/funds/${fundId}`, {
      title: title,
      description: description,
    });

    return {
      ok: true,
      message: 'Fund successfully edited',
    };
  } catch (error) {
    console.error('Error', error);
    return {
      ok: false,
      message: 'Failed to edit fund',
    };
  }
};

const FundRoute: RouteObject = {
  path: '/funds/:fundId',
  element: <FundPage />,
  loader: loader,
  action: action,
};

export default FundRoute;
