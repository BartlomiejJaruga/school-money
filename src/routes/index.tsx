import { createBrowserRouter } from 'react-router-dom';
import { PlainLayout } from './layouts/PlainLayout';
import { AsideLayout } from './layouts/AsideLayout';
import { ErrorPage } from '@pages/ErrorPage';
import RootRoute from '@routes/root.route';
import FundsRoute from '@routes/funds.route';
import KidsRoute from '@routes/kids.route';
import LogoutRoute from '@routes/_logout.route';
import CreatedFundsRoute from '@routes/createdFunds.route';
import ClassesRoute from '@routes/classes.route';
import ClassRoute from '@routes/class.route';
import FundRoute from '@routes/fund.route';
import PaymentHistoryRoute from '@routes/paymentHistory.route';
import ProfileRoute from '@routes/profile.route';

export const router = createBrowserRouter([
  {
    element: <PlainLayout />,
    errorElement: <ErrorPage />,
    children: [RootRoute],
  },
  {
    element: <AsideLayout />,
    errorElement: <ErrorPage />,
    children: [
      FundsRoute,
      KidsRoute,
      LogoutRoute,
      CreatedFundsRoute,
      ClassesRoute,
      ClassRoute,
      FundRoute,
      PaymentHistoryRoute,
      ProfileRoute,
    ],
  },
]);
