import reducer, {
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown,
  clearConstructor,
} from './constructorSlice';

import type { TIngredient, TConstructorIngredient } from '../../utils/types';

const createIngredient = (id: string, type = 'main'): TIngredient => ({
  _id: id,
  name: id,
  type,
  proteins: 1,
  fat: 2,
  carbohydrates: 3,
  calories: 4,
  price: 100,
  image: 'image',
  image_large: 'large',
  image_mobile: 'mobile',
});

const withId = (id: string): TConstructorIngredient => ({
  ...createIngredient(id),
  id,
});

describe('burger constructor reducer', () => {
  test('returns initial state for unknown action', () => {
    expect(reducer(undefined, { type: 'UNKNOWN' })).toEqual({
      bun: null,
      ingredients: [],
    });
  });

  test('adds and replaces bun', () => {
    const first = reducer(undefined, addIngredient(createIngredient('bun-1', 'bun')));

    expect(first.bun?._id).toBe('bun-1');
    expect(typeof first.bun?.id).toBe('string');
    expect(first.ingredients).toEqual([]);

    const second = reducer(first, addIngredient(createIngredient('bun-2', 'bun')));

    expect(second.bun?._id).toBe('bun-2');
  });

  test('adds filling with generated id', () => {
    const state = reducer(undefined, addIngredient(createIngredient('main-1')));

    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]._id).toBe('main-1');
    expect(typeof state.ingredients[0].id).toBe('string');
  });

  test('removes filling by index', () => {
    const state = {
      bun: null,
      ingredients: [withId('a'), withId('b')],
    };

    expect(reducer(state, removeIngredient(0)).ingredients.map((x) => x._id)).toEqual([
      'b',
    ]);
  });

  test('moves filling up', () => {
    const state = {
      bun: null,
      ingredients: [withId('a'), withId('b'), withId('c')],
    };

    expect(reducer(state, moveIngredientUp(2)).ingredients.map((x) => x._id)).toEqual([
      'a',
      'c',
      'b',
    ]);

    expect(reducer(state, moveIngredientUp(0))).toEqual(state);
  });

  test('moves filling down', () => {
    const state = {
      bun: null,
      ingredients: [withId('a'), withId('b'), withId('c')],
    };

    expect(reducer(state, moveIngredientDown(0)).ingredients.map((x) => x._id)).toEqual([
      'b',
      'a',
      'c',
    ]);

    expect(reducer(state, moveIngredientDown(2))).toEqual(state);
  });

  test('clears bun and fillings', () => {
    const state = {
      bun: { ...createIngredient('bun', 'bun'), id: 'bun' },
      ingredients: [withId('a')],
    };

    expect(reducer(state, clearConstructor())).toEqual({
      bun: null,
      ingredients: [],
    });
  });
});
