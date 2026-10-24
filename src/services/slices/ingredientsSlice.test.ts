import reducer, { getIngredientsThunk } from './ingredientsSlice';

import type { TIngredient } from '../../utils/types';

const ingredient: TIngredient = {
  _id: 'test-bun',
  name: 'Тестовая булка',
  type: 'bun',
  proteins: 10,
  fat: 10,
  carbohydrates: 20,
  calories: 200,
  price: 200,
  image: 'image',
  image_large: 'large',
  image_mobile: 'mobile',
};

describe('ingredients reducer', () => {
  test('returns initial state for unknown action', () => {
    expect(reducer(undefined, { type: 'UNKNOWN' })).toEqual({
      ingredients: [],
      isLoading: false,
      error: null,
    });
  });

  test('handles pending', () => {
    expect(
      reducer(undefined, getIngredientsThunk.pending('request-id', undefined))
    ).toEqual({
      ingredients: [],
      isLoading: true,
      error: null,
    });
  });

  test('handles fulfilled', () => {
    const loading = reducer(
      undefined,
      getIngredientsThunk.pending('request-id', undefined)
    );
    expect(
      reducer(
        loading,
        getIngredientsThunk.fulfilled([ingredient], 'request-id', undefined)
      )
    ).toEqual({
      ingredients: [ingredient],
      isLoading: false,
      error: null,
    });
  });

  test('handles rejected and stores error', () => {
    const error = new Error('Network failure');
    const loading = reducer(
      undefined,
      getIngredientsThunk.pending('request-id', undefined)
    );
    const result = reducer(
      loading,
      getIngredientsThunk.rejected(error, 'request-id', undefined)
    );
    expect(result.isLoading).toBe(false);
    expect(result.error).toEqual(
      expect.objectContaining({ message: 'Network failure' })
    );
  });
});
