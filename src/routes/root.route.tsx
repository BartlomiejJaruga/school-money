import {
  redirect,
  type ActionFunction,
  type ActionFunctionArgs,
  type LoaderFunction,
  type RouteObject,
} from 'react-router-dom';
import { AuthenticationPage } from '@pages/AuthenticationPage';
import axiosInstance from '@services/axiosInstance';
import { isAxiosError } from 'axios';
import {
  AUTHENTICATION_PAGE_ASIDE_TYPE_ENUM,
  type UserRoleType,
} from '@lib/constants';
import {
  getUserData,
  saveAuthData,
  saveUserData,
  type AuthData,
  type UserData,
} from '@lib/session';

export type AuthenticationResponse = {
  ok: boolean;
  status: number;
  message?: string;
};

const action: ActionFunction = async ({
  request,
}: ActionFunctionArgs): Promise<AuthenticationResponse> => {
  const formData = await request.formData();
  const formType = formData.get('formType');

  if (formType == 'register') {
    return registerUser(formData);
  } else if (formType == 'login') {
    return loginUser(formData);
  }

  return {
    ok: false,
    status: 400,
    message: 'Unknown form type',
  };
};

async function registerUser(
  formData: FormData
): Promise<AuthenticationResponse> {
  const email = String(formData.get('email') ?? '');
  const password = String(formData.get('password') ?? '');
  const firstName = String(formData.get('firstName') ?? '');
  const lastName = String(formData.get('lastName') ?? '');

  console.log({ email, password, firstName, lastName });

  try {
    const requestBody = {
      first_name: firstName,
      last_name: lastName,
      email: email,
      password: password,
    };

    const response = await axiosInstance.post('/v1/auth/register', requestBody);
    console.log(response);

    return redirect(`/?asideType=${AUTHENTICATION_PAGE_ASIDE_TYPE_ENUM.Login}`);
  } catch (error) {
    console.error('Error', error);

    if (isAxiosError(error)) {
      return {
        ok: false,
        status: error.status ?? 500,
        message: error.response?.data?.message ?? 'Unknown server error.',
      };
    }

    return {
      ok: false,
      status: 500,
      message: 'Unknown server error.',
    };
  }
}

async function loginUser(
  formData: FormData,
  redirectTo: string = '/funds'
): Promise<AuthenticationResponse> {
  const email = String(formData.get('email') ?? '');
  const password = String(formData.get('password') ?? '');

  console.log({ email, password });

  try {
    const requestBody = {
      email: email,
      password: password,
    };

    const response = await axiosInstance.post(
      '/v1/auth/authenticate',
      requestBody
    );
    console.log(response);

    const userData: UserData = {
      userId: response.data.user_id,
      role: response.data.role as UserRoleType,
      firstName: response.data.first_name,
      lastName: response.data.last_name,
    };
    saveUserData(userData);

    const authData: AuthData = {
      accessToken: response.data.access_token,
      refreshToken: response.data.refresh_token,
    };
    saveAuthData(authData);

    return redirect(redirectTo);
  } catch (error) {
    console.error('Error', error);

    if (isAxiosError(error)) {
      return {
        ok: false,
        status: error.status ?? 500,
        message: error.response?.data?.message ?? 'Unknown server error.',
      };
    }

    return {
      ok: false,
      status: 500,
      message: 'Unknown server error.',
    };
  }
}

const loader: LoaderFunction = async () => {
  const userData = getUserData();
  if (userData) return redirect('/funds');
};

const RootRoute: RouteObject = {
  path: '/',
  element: <AuthenticationPage />,
  action: action,
  loader: loader,
};

export default RootRoute;
