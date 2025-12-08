import { ProfilePage } from '@pages/ProfilePage';
import type { RouteObject } from 'react-router-dom';

const ProfileRoute: RouteObject = {
  path: '/profile',
  element: <ProfilePage />,
};

export default ProfileRoute;
