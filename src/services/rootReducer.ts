import { combineReducers } from '@reduxjs/toolkit';

import constructorReducer from '../services/slices/constructorSlice';
import feedReducer from '../services/slices/feedSlice';
import ingredientsReducer from '../services/slices/ingredientsSlice';
import orderReducer from '../services/slices/orderSlice';
import userReducer from '../services/slices/userSlice';
// TODO: Заменить на настоящий корневой редьюсер
export const rootReducer = combineReducers({
  // TODO: Собрать здесь редьюсеры слайсов
  ingredients: ingredientsReducer,
  constructorBurger: constructorReducer,
  feed: feedReducer,
  order: orderReducer,
  user: userReducer,
});
