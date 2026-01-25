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
import { loader as authenticationLoader } from '@routes/_authenticated.route';
import FundPaymentRoute from '@routes/_fundPayment.route';
import FundRejectRoute from '@routes/_fundReject.route';
import FundCancelRoute from '@routes/_fundCancel.route';
import FundWithdrawalRoute from '@routes/_fundWithdrawal.route';
import FundDepositRoute from '@routes/_fundDeposit.route';
import WalletWithdrawalRoute from '@routes/_walletWithdrawal.route';
import WalletTopUpRoute from './_walletTopUp.route';

export const router = createBrowserRouter([
  {
    element: <PlainLayout />,
    errorElement: <ErrorPage />,
    children: [RootRoute],
  },
  {
    id: 'aside-layout',
    element: <AsideLayout />,
    errorElement: <ErrorPage />,
    loader: authenticationLoader,
    children: [
      FundsRoute,
      KidsRoute,
      LogoutRoute,
      CreatedFundsRoute,
      ClassRoute,
      ClassesRoute,
      FundRoute,
      PaymentHistoryRoute,
      ProfileRoute,
      FundPaymentRoute,
      FundRejectRoute,
      FundCancelRoute,
      FundWithdrawalRoute,
      FundDepositRoute,
      WalletWithdrawalRoute,
      WalletTopUpRoute,
    ],
  },
]);
