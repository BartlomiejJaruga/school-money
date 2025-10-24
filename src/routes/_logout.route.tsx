import {
  redirect,
  type ActionFunction,
  type LoaderFunction,
  type RouteObject,
} from 'react-router-dom';

export const loader: LoaderFunction = async () => {
  // checking if user logged in here and redirecting

  return redirect('/');
};

export const action: ActionFunction = async () => {
  // removing user data and tokens here

  return redirect('/');
};

const LogoutRoute: RouteObject = {
  id: 'logout',
  path: '/logout',
  element: null,
  action: action,
  loader: loader,
};

export default LogoutRoute;
