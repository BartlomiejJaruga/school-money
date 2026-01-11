import type { SchoolClassResponseDto } from '@dtos/SchoolClassResponseDto';
import { getUserData } from '@lib/session';
import { formatDateToISO } from '@lib/utils';
import { CreatedFundsPage } from '@pages/CreatedFundsPage';
import axiosInstance from '@services/axiosInstance';
import {
  redirect,
  type ActionFunction,
  type ActionFunctionArgs,
  type LoaderFunction,
  type RouteObject,
} from 'react-router-dom';

export type CreatedFundsLoaderData = {
  treasurerClasses: SchoolClassResponseDto[] | null;
};

export const loader: LoaderFunction = async () => {
  const userData = getUserData();
  if (!userData) return redirect('/');

  const classes = await fetchChildrenClasses();
  const treasurerClasses = classes
    ? classes.filter(
        (schoolClass) => schoolClass.treasurer.user_id == userData.userId
      )
    : null;

  const createdFundsLoaderData: CreatedFundsLoaderData = {
    treasurerClasses: treasurerClasses,
  };

  return createdFundsLoaderData;
};

const fetchChildrenClasses = async (): Promise<
  SchoolClassResponseDto[] | null
> => {
  try {
    const response = await axiosInstance.get('/v1/parents/school-classes');

    return response.data?.content ?? null;
  } catch (error) {
    console.error('Error', error);
    return null;
  }
};

const action: ActionFunction = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();

  const title = formData.get('title');
  const description = formData.get('description');
  const schoolClassId = formData.get('schoolClassId');
  const startDate = formData.get('startDate') as string;
  const endDate = formData.get('endDate') as string;
  const costPerChild = Number(formData.get('costPerChild'));

  try {
    const response = await axiosInstance.post('/v1/funds', {
      school_class_id: schoolClassId,
      title: title,
      description: description,
      starts_at: formatDateToISO(startDate, true),
      ends_at: formatDateToISO(endDate),
      amount_per_child_in_cents: costPerChild * 100,
    });

    console.log('Creating fund:', response);
  } catch (error) {
    console.error('Error', error);
  }

  return {
    ok: true,
    status: 200,
    message: 'New fund created',
  };
};

const CreatedFundsRoute: RouteObject = {
  path: '/created-funds',
  element: <CreatedFundsPage />,
  loader: loader,
  action: action,
};

export default CreatedFundsRoute;
