import { PROFILE_FORM_TYPE_ENUM } from '@lib/constants';
import { getUserData } from '@lib/session';
import { ProfilePage } from '@pages/ProfilePage';
import axiosInstance from '@services/axiosInstance';
import {
  redirect,
  type ActionFunction,
  type ActionFunctionArgs,
  type LoaderFunction,
  type RouteObject,
} from 'react-router-dom';

export const loader: LoaderFunction = async () => {
  const loggedInUserData = getUserData();
  if (!loggedInUserData) redirect('/');
};

const action: ActionFunction = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const formType = formData.get('formType');

  if (formType == PROFILE_FORM_TYPE_ENUM.basicInfoForm) {
    const firstName = formData.get('firstName');
    const lastName = formData.get('lastName');
    const emailAddress = formData.get('emailAddress');

    try {
      await axiosInstance.patch('/v1/parents', {
        first_name: firstName,
        last_name: lastName,
      });

      const changeEmail = formData.get('changeEmail') == 'true';
      if (changeEmail) {
        console.log('changing email!');
        await axiosInstance.post(
          '/v1/users/email/change/request',
          {},
          {
            params: {
              newEmail: emailAddress,
            },
          }
        );

        redirect('/logout');
      }

      return { ok: true, status: 200, message: 'Data changed successfully' };
    } catch (error) {
      console.error(error);

      return {
        ok: false,
        status: 404,
        message: 'Error while changing data.',
      };
    }
  } else if (formType == PROFILE_FORM_TYPE_ENUM.changePasswordForm) {
    const currentPassword = formData.get('currentPassword');
    const newPassword = formData.get('newPassword');
    const repeatNewPassword = formData.get('repeatNewPassword');

    console.log({ currentPassword, newPassword, repeatNewPassword });
  } else if (formType == PROFILE_FORM_TYPE_ENUM.updateAvatar) {
    const file = formData.get('avatarFile') as File;

    if (file && file.size > 0) {
      try {
        const requestFormData = new FormData();
        requestFormData.append('avatarFile', file);

        await axiosInstance.patch('/v1/parents/avatar', requestFormData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        return { ok: true, status: 200, message: 'Data changed successfully' };
      } catch (error) {
        console.error(error);

        return {
          ok: false,
          status: 404,
          message: 'Error while uploading new avatar.',
        };
      }
    }
  } else {
    console.log('[PROFILE ACTION] Other form type submitted.');
  }

  return {
    ok: true,
    status: 200,
    message: 'Data changed successfully',
  };
};

const ProfileRoute: RouteObject = {
  path: '/profile',
  element: <ProfilePage />,
  loader: loader,
  action: action,
};

export default ProfileRoute;
