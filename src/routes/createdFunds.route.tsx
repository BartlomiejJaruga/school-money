import { CreatedFundsPage } from '@pages/CreatedFundsPage';
import type {
  ActionFunction,
  ActionFunctionArgs,
  RouteObject,
} from 'react-router-dom';

const action: ActionFunction = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();

  const title = formData.get('title');
  const description = formData.get('description');
  const startDate = formData.get('startDate');
  const endDate = formData.get('endDate');
  const costPerChild = formData.get('costPerChild');

  console.log({ title, description, startDate, endDate, costPerChild });

  return {
    ok: true,
    status: 200,
    message: 'New fund created',
  };
};

const CreatedFundsRoute: RouteObject = {
  path: '/created-funds',
  element: <CreatedFundsPage />,
  action: action,
};

export default CreatedFundsRoute;
