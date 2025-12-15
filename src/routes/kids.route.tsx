import type { ChildData } from '@lib/constants';
import { getUserData } from '@lib/session';
import { KidsPage } from '@pages/KidsPage';
import axiosInstance from '@services/axiosInstance';
import {
  redirect,
  type ActionFunction,
  type ActionFunctionArgs,
  type LoaderFunction,
  type RouteObject,
} from 'react-router-dom';

export type KidsLoaderData = {
  children: ChildData[] | null;
};

export const loader: LoaderFunction = async () => {
  const userData = getUserData();
  if (!userData) return redirect('/');

  const children = await fetchParentChildren();

  const kidsLoaderData: KidsLoaderData = {
    children: children,
  };

  return kidsLoaderData;
};

const fetchParentChildren = async (): Promise<ChildData[] | null> => {
  try {
    const response = await axiosInstance.get('/v1/children');
    console.log(response);

    const children: ChildData[] = response.data.content.map((child: any) => {
      const childData: ChildData = {
        id: child.child_id,
        schoolClass: {
          id: child.school_class?.school_class_id ?? 'no info',
          name: child.school_class?.school_class_name ?? 'no info',
          year: child.school_class?.school_class_year ?? 'no info',
        },
        firstName: child.first_name,
        lastName: child.last_name,
        birthday: child.birth_date,
      };

      return childData;
    });

    return children;
  } catch (error) {
    console.error('Error', error);
    return null;
  }
};

const action: ActionFunction = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();

  const childId = formData.get('childId');
  const firstName = formData.get('firstName');
  const lastName = formData.get('lastName');
  const birthday = formData.get('birthday');

  console.log({ childId });

  if (childId === 'no-id') {
    try {
      const requestBody = {
        first_name: firstName,
        last_name: lastName,
        birth_date: birthday,
      };

      const response = await axiosInstance.post('/v1/children', requestBody);
      console.log(response);
    } catch (error) {
      console.error('Error', error);
    }
  } else {
    try {
      const requestBody = {
        first_name: firstName,
        last_name: lastName,
        birth_date: birthday,
      };

      const response = await axiosInstance.patch(
        `/v1/children/${childId}`,
        requestBody
      );
      console.log(response);
    } catch (error) {
      console.error('Error', error);
    }
  }
};

const KidsRoute: RouteObject = {
  path: '/kids',
  element: <KidsPage />,
  action: action,
  loader: loader,
};

export default KidsRoute;
