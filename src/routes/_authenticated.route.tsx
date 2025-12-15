import { getUserData } from '@lib/session';
import { redirect, type LoaderFunction } from 'react-router-dom';

export const loader: LoaderFunction = async () => {
  const userData = getUserData();
  if (!userData) return redirect('/');
};
