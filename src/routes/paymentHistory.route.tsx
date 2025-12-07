import { PaymentHistoryPage } from '@pages/PaymentHistoryPage';
import type { RouteObject } from 'react-router-dom';

const PaymentHistoryRoute: RouteObject = {
  path: '/payment-history',
  element: <PaymentHistoryPage />,
};

export default PaymentHistoryRoute;
