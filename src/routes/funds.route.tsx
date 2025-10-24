import { FundsPage } from '@pages/FundsPage';
import type { RouteObject } from 'react-router-dom';

const FundsRoute: RouteObject = {
  path: '/funds',
  element: <FundsPage />,
};

export default FundsRoute;
