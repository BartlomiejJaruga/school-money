import {
  redirect,
  type ActionFunction,
  type ActionFunctionArgs,
  type RouteObject,
} from 'react-router-dom';
import { AuthenticationPage } from '@pages/AuthenticationPage';

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

function loginUser(formData: FormData): AuthenticationResponse {
  const email = String(formData.get('email') ?? '');
  const password = String(formData.get('password') ?? '');

  console.log({ email, password });

  return redirect('/funds');
}

const RootRoute: RouteObject = {
  path: '/',
  element: <AuthenticationPage />,
  action: action,
};

export default RootRoute;
