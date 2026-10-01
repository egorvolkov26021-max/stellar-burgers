import { getOrderThunk } from '@slices/orderSlice';
import { ProfileOrdersUI } from '@ui-pages';
import { useEffect } from 'react';

import { useDispatch, useSelector } from '@services/store';

import type { TOrder } from '@utils-types';

export const ProfileOrders = (): React.JSX.Element => {
  /** TODO: взять переменную из стора */
  const dispatch = useDispatch();
  const orders: TOrder[] = useSelector((state) => state.order.orders);
  useEffect(() => {
    void dispatch(getOrderThunk());
  }, [dispatch]);
  return <ProfileOrdersUI orders={orders} />;
};
