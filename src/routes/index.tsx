import { createBrowserRouter } from 'react-router-dom';
import { PlainLayout } from './layouts/PlainLayout';
import { AsideLayout } from './layouts/AsideLayout';
import { ErrorPage } from '@pages/ErrorPage';
import RootRoute from '@routes/root.route';
import FundsRoute from '@routes/funds.route';
import LogoutRoute from '@routes/_logout.route';

export const router = createBrowserRouter([
  {
    element: <PlainLayout />,
    errorElement: <ErrorPage />,
    children: [RootRoute],
  },
  {
    element: <AsideLayout />,
    errorElement: <ErrorPage />,
    children: [FundsRoute, LogoutRoute],
  },
]);
