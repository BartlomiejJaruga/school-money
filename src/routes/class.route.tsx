import type { PageableResponseDTO } from '@dtos/_PageableResponseDTO';
import type { ChildWithParentInfoResponseDto } from '@dtos/ChildWithParentInfoResponseDto';
import type { PagedModelParentChildUnpaidFundResponseDto } from '@dtos/PagedModelParentChildUnpaidFundResponseDto';
import type { SchoolClassResponseDto } from '@dtos/SchoolClassResponseDto';
import { ClassPage } from '@pages/ClassPage';
import axiosInstance from '@services/axiosInstance';
import type {
  LoaderFunction,
  LoaderFunctionArgs,
  RouteObject,
} from 'react-router-dom';

export type ClassLoaderData = {
  classData: SchoolClassResponseDto | null;
  children: ChildWithParentInfoResponseDto[] | null;
  funds: PageableResponseDTO<PagedModelParentChildUnpaidFundResponseDto> | null;
};

export const loader: LoaderFunction = async ({
  params,
  request,
}: LoaderFunctionArgs) => {
  const classId = params.classId ?? null;

  const [classData, children, funds] = await Promise.all([
    fetchClassData(classId),
    fetchClassChildren(classId),
    fetchUnpaidClassFunds(classId, request),
  ]);

  const classLoaderData: ClassLoaderData = {
    classData: classData,
    children: children,
    funds: funds,
  };

  return classLoaderData;
};

const fetchClassData = async (
  classId: string | null
): Promise<SchoolClassResponseDto | null> => {
  if (!classId) return null;

  try {
    const response = await axiosInstance.get(`/v1/school-classes/${classId}`);

    return response.data ?? null;
  } catch (error) {
    console.error('Error', error);
    return null;
  }
};

const fetchClassChildren = async (
  classId: string | null
): Promise<ChildWithParentInfoResponseDto[] | null> => {
  if (!classId) return null;

  try {
    const response = await axiosInstance.get(
      `/v1/school-classes/${classId}/children`,
      {
        params: {
          page: 0,
          size: 50,
          sort: 'lastName,firstName,birthDate,ASC',
        },
      }
    );

    return response.data?.content ?? null;
  } catch (error) {
    console.error('Error', error);
    return null;
  }
};

const fetchUnpaidClassFunds = async (
  classId: string | null,
  request: Request
): Promise<PageableResponseDTO<PagedModelParentChildUnpaidFundResponseDto> | null> => {
  if (!classId) return null;

  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('fundsPage') || '0', 10);

  try {
    const response = await axiosInstance.get(
      `/v1/school-classes/${classId}/funds/unpaid`,
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

const ClassRoute: RouteObject = {
  path: '/classes/:classId', // change to class name with year
  element: <ClassPage />,
  loader: loader,
};

export default ClassRoute;
