import { clearOrderModal, createOrderThunk } from '@slices/orderSlice';
import { BurgerConstructorUI } from '@ui';
import { useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { useSelector, useDispatch } from '@services/store';

import type { TConstructorIngredient, TConstructorState, TOrder } from '@utils-types';
export const BurgerConstructor = (): React.JSX.Element | null => {
  /** TODO: Взять переменные constructorItems, orderRequest и orderModalData из стора */
  const constructorItems: TConstructorState = useSelector(
    (state) => state.constructorBurger
  );
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);

  const orderRequest = useSelector((state) => state.order.orderRequest);
  const orderModalData: TOrder | null = useSelector(
    (state) => state.order.orderModalData
  );
  const location = useLocation();
  const dispatch = useDispatch();
  const onOrderClick = (): void => {
    if (!user) {
      void navigate('/login', {
        state: { from: location },
      });
      return;
    }

    if (!constructorItems.bun || orderRequest) return;
    const ingredientsId: string[] = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((i) => i._id),
      constructorItems.bun._id,
    ];
    void dispatch(createOrderThunk(ingredientsId));
  };

  const closeOrderModal = (): void => {
    void dispatch(clearOrderModal());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
