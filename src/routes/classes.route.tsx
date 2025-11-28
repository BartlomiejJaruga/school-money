import { ClassesPage } from '@pages/ClassesPage';
import type { RouteObject } from 'react-router-dom';

const ClassesRoute: RouteObject = {
  path: '/classes',
  element: <ClassesPage />,
};

export default ClassesRoute;
