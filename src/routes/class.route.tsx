import type { ChildWithParentInfoResponseDto } from '@dtos/ChildWithParentInfoResponseDto';
import type { FundResponseDTO } from '@dtos/FundResponseDto';
import { ClassPage } from '@pages/ClassPage';
import axiosInstance from '@services/axiosInstance';
import type {
  LoaderFunction,
  LoaderFunctionArgs,
  RouteObject,
} from 'react-router-dom';

export type ClassLoaderData = {
  children: ChildWithParentInfoResponseDto[] | null;
  funds: FundResponseDTO[] | null;
};

export const loader: LoaderFunction = async ({
  params,
}: LoaderFunctionArgs) => {
  const classId = params.classId ?? null;

  const children = await fetchClassChildren(classId);
  const funds = await fetchClassFunds(classId);

  const classLoaderData: ClassLoaderData = {
    children: children,
    funds: funds,
  };

  return classLoaderData;
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

const fetchClassFunds = async (
  classId: string | null
): Promise<FundResponseDTO[] | null> => {
  if (!classId) return null;

  try {
    const response = await axiosInstance.get(
      `/v1/school-classes/${classId}/funds`,
      {
        params: {
          page: 0,
          size: 50,
          sort: 'endsAt,ASC',
        },
      }
    );

    return response.data?.content ?? null;
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
