import type { SchoolClassResponseDto } from '@dtos/SchoolClassResponseDto';
import { getUserData } from '@lib/session';
import { ClassesPage } from '@pages/ClassesPage';
import axiosInstance from '@services/axiosInstance';
import {
  redirect,
  type ActionFunction,
  type ActionFunctionArgs,
  type LoaderFunction,
  type RouteObject,
} from 'react-router-dom';

export type ClassesLoaderData = {
  classes: SchoolClassResponseDto[] | null;
};

export const loader: LoaderFunction = async () => {
  const userData = getUserData();
  if (!userData) return redirect('/');

  const classes = await fetchChildrenClasses();

  const classesLoaderData: ClassesLoaderData = {
    classes: classes,
  };

  return classesLoaderData;
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

  const schoolClassName = formData.get('schoolClassName') as string;
  const schoolClassYear = formData.get('schoolClassYear') as string;

  try {
    axiosInstance.post('/v1/school-classes', {
      school_class_name: schoolClassName,
      school_class_year: schoolClassYear,
    });
  } catch (error) {
    console.error('Error', error);
  }
};

const ClassesRoute: RouteObject = {
  path: '/classes',
  element: <ClassesPage />,
  loader: loader,
  action: action,
};

export default ClassesRoute;
