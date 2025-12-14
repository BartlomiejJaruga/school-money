import {
  redirect,
  type ActionFunction,
  type LoaderFunction,
  type RouteObject,
} from 'react-router-dom';

const loader: LoaderFunction = async () => {
  // checking if user logged in here and removing user data and tokens here

  return redirect('/');
};

const action: ActionFunction = async () => {
  // checking if user logged in here and removing user data and tokens here

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
