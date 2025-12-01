import { FundPage } from '@pages/FundPage';
import type { RouteObject } from 'react-router-dom';

const FundRoute: RouteObject = {
  path: '/funds/fund',
  element: <FundPage />,
};

export default FundRoute;
