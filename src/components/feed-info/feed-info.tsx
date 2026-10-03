import { FeedInfoUI } from '@ui';

import { useSelector } from '@services/store';

export const FeedInfo = (): React.JSX.Element => {
  const feed = useSelector((state) => state.feed);

  const readyOrders = feed.orders
    .filter((order) => order.status === 'done')
    .slice(0, 10)
    .map((order) => order.number);

  const pendingOrders = feed.orders
    .filter((order) => order.status === 'pending')
    .slice(0, 10)
    .map((order) => order.number);

  return (
    <FeedInfoUI feed={feed} readyOrders={readyOrders} pendingOrders={pendingOrders} />
  );
};
