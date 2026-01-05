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

    const children: ChildData[] = response.data.content.map((child: any) => {
      const childData: ChildData = {
        id: child.child_id,
        schoolClass: {
          id: child.school_class?.school_class_id ?? '',
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

  const childId = formData.get('childId') as string;
  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;
  const birthday = formData.get('birthday') as string;
  const invitationCode = formData.get('invitationCode') as string;
  const avatarFile = formData.get('avatarFile') as File | null;
  const deletePhoto = formData.get('deletePhoto') == 'true';

  let currentChildId = childId;

  try {
    if (childId === 'no-id') {
      const response = await axiosInstance.post('/v1/children', {
        first_name: firstName,
        last_name: lastName,
        birth_date: birthday,
      });

      currentChildId = response.data.id;
    } else {
      await axiosInstance.patch(`/v1/children/${childId}`, {
        first_name: firstName,
        last_name: lastName,
        birth_date: birthday,
      });
    }

    if (!deletePhoto && avatarFile && avatarFile.size > 0 && currentChildId) {
      const avatarFormData = new FormData();
      avatarFormData.append('avatarFile', avatarFile);

      await axiosInstance.patch(
        `/v1/children/${currentChildId}/avatar`,
        avatarFormData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
    } else if (deletePhoto && currentChildId) {
      await axiosInstance.delete(`/v1/children/${currentChildId}/avatar`);
    }

    if (invitationCode && currentChildId) {
      await axiosInstance.post(
        `/v1/children/${currentChildId}/school-class`,
        {},
        {
          params: {
            invitationCode: invitationCode,
          },
        }
      );
    }
  } catch (error) {
    console.error('Error', error);
  }
};

const KidsRoute: RouteObject = {
  path: '/kids',
  element: <KidsPage />,
  action: action,
  loader: loader,
};

export default KidsRoute;
