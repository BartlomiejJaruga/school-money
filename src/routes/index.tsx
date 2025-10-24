import { createBrowserRouter } from 'react-router-dom';
import { PlainLayout } from './layouts/PlainLayout';
import { AsideLayout } from './layouts/AsideLayout';
import RootRoute from '@routes/root.route';
import FundsRoute from '@routes/funds.route';
import LogoutRoute from '@routes/_logout.route';

export const router = createBrowserRouter([
  {
    element: <PlainLayout />,
    children: [RootRoute],
  },
  {
    element: <AsideLayout />,
    children: [FundsRoute, LogoutRoute],
  },
]);
