import { BurgerConstructorElementUI } from '@ui';
import { memo } from 'react';

import { useDispatch } from '@services/store';

import {
  moveIngredientDown,
  moveIngredientUp,
  removeIngredient,
} from '../../services/slices/constructorSlice';

import type { BurgerConstructorElementProps } from './type';

export const BurgerConstructorElement = memo(function BurgerConstructorElement({
  ingredient,
  index,
  totalItems,
}: BurgerConstructorElementProps): React.JSX.Element {
  const dispatch = useDispatch();
  const handleMoveDown = (): void => {
    void dispatch(moveIngredientDown(index));
  };

  const handleMoveUp = (): void => {
    void dispatch(moveIngredientUp(index));
  };

  const handleClose = (): void => {
    void dispatch(removeIngredient(index));
  };

  return (
    <BurgerConstructorElementUI
      ingredient={ingredient}
      index={index}
      totalItems={totalItems}
      handleMoveUp={handleMoveUp}
      handleMoveDown={handleMoveDown}
      handleClose={handleClose}
    />
  );
});
