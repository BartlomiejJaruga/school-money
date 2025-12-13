import {
  redirect,
  type ActionFunction,
  type ActionFunctionArgs,
  type RouteObject,
} from 'react-router-dom';
import { AuthenticationPage } from '@pages/AuthenticationPage';
import axiosInstance from '@services/axiosInstance';
import { isAxiosError } from 'axios';

export type AuthenticationResponse = {
  ok: boolean;
  status: number;
  message?: string;
};

export const action: ActionFunction = async ({
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

function registerUser(formData: FormData): AuthenticationResponse {
  const email = String(formData.get('email') ?? '');
  const password = String(formData.get('password') ?? '');
  const firstName = String(formData.get('firstName') ?? '');
  const lastName = String(formData.get('lastName') ?? '');

  console.log({ email, password, firstName, lastName });

  return {
    ok: true,
    status: 200,
    message: 'User created successfully',
  };
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

const RootRoute: RouteObject = {
  path: '/',
  element: <AuthenticationPage />,
  action: action,
};

export default RootRoute;
