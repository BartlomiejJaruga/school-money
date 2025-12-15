import {
  redirect,
  type ActionFunction,
  type LoaderFunction,
  type RouteObject,
} from 'react-router-dom';

const loader: LoaderFunction = async () => {
  sessionStorage.clear();

  return redirect('/');
};

const action: ActionFunction = async () => {
  sessionStorage.clear();

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
