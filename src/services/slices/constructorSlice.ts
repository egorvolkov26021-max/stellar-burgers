import { createSlice, nanoid, type PayloadAction } from '@reduxjs/toolkit';

import type {
  TConstructorState,
  TIngredient,
  TConstructorIngredient,
} from '../../utils/types';

const initialState: TConstructorState = {
  bun: null,
  ingredients: [],
};

export const constructorSlice = createSlice({
  name: 'constructor',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.bun = action.payload;
        } else {
          state.ingredients.push(action.payload);
        }
      },

      prepare: (ingredient: TIngredient) => {
        return {
          payload: {
            ...ingredient,
            id: nanoid(),
          },
        };
      },
    },
    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    },
    removeIngredient: (state, action: PayloadAction<number>) => {
      state.ingredients.splice(action.payload, 1);
    },

    moveIngredientUp: (state, action: PayloadAction<number>) => {
      if (action.payload === 0) return;
      [state.ingredients[action.payload], state.ingredients[action.payload - 1]] = [
        state.ingredients[action.payload - 1],
        state.ingredients[action.payload],
      ];
    },
    moveIngredientDown: (state, action: PayloadAction<number>) => {
      if (action.payload === state.ingredients.length - 1) return;
      [state.ingredients[action.payload + 1], state.ingredients[action.payload]] = [
        state.ingredients[action.payload],
        state.ingredients[action.payload + 1],
      ];
    },
  },
});

export default constructorSlice.reducer;
export const { addIngredient } = constructorSlice.actions;
export const { removeIngredient } = constructorSlice.actions;
export const { moveIngredientUp } = constructorSlice.actions;
export const { moveIngredientDown } = constructorSlice.actions;
export const { clearConstructor } = constructorSlice.actions;
