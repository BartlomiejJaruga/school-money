import { KidsPage } from '@pages/KidsPage';
import type { RouteObject } from 'react-router-dom';

const KidsRoute: RouteObject = {
  path: '/kids',
  element: <KidsPage />,
};

export default KidsRoute;
