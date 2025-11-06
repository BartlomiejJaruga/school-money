import { KidsPage } from '@pages/KidsPage';
import type {
  ActionFunction,
  ActionFunctionArgs,
  RouteObject,
} from 'react-router-dom';

export const action: ActionFunction = async ({
  request,
}: ActionFunctionArgs) => {
  const formData = await request.formData();

  const firstName = formData.get('firstName');
  const lastName = formData.get('lastName');
  const birthday = formData.get('birthday');

  console.log({ firstName, lastName, birthday });

  return {
    ok: true,
    status: 200,
    message: 'Child added',
  };
};

const KidsRoute: RouteObject = {
  path: '/kids',
  element: <KidsPage />,
  action: action,
};

export default KidsRoute;
