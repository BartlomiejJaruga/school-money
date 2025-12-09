import { PROFILE_FORM_TYPE_ENUM } from '@lib/constants';
import { ProfilePage } from '@pages/ProfilePage';
import type {
  ActionFunction,
  ActionFunctionArgs,
  RouteObject,
} from 'react-router-dom';

const action: ActionFunction = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const formType = formData.get('formType');

  if (formType == PROFILE_FORM_TYPE_ENUM.basicInfoForm) {
    const firstName = formData.get('firstName');
    const lastName = formData.get('lastName');
    const emailAddress = formData.get('emailAddress');

    console.log({ firstName, lastName, emailAddress });
  } else if (formType == PROFILE_FORM_TYPE_ENUM.changePasswordForm) {
    console.log('Change password form submitted.');
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
  action: action,
};

export default ProfileRoute;
