import type { RouteObject } from 'react-router-dom';
import { AuthenticationPage } from '@pages/AuthenticationPage';

const RootRoute: RouteObject = {
  path: '/',
  element: <AuthenticationPage />,
};

export default RootRoute;
