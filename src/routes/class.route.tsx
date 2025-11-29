import { ClassPage } from '@pages/ClassPage';
import type { RouteObject } from 'react-router-dom';

const ClassRoute: RouteObject = {
  path: '/classes/class', // change to class name with year
  element: <ClassPage />,
};

export default ClassRoute;
