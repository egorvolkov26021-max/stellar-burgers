import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { clearConstructor } from '@slices/constructorSlice';

import {
  orderBurgerApi,
  getOrderByNumberApi,
  getOrdersApi,
} from '../../utils/burger-api';

import type { TOrderState } from '../../utils/types';

export const getOrderThunk = createAsyncThunk('order/getOrder', async () => {
  return getOrdersApi();
});

export const createOrderThunk = createAsyncThunk(
  'order/createOrder',
  async (ingredients: string[], { dispatch }) => {
    const response = await orderBurgerApi(ingredients);

    dispatch(clearConstructor());

    return response;
  }
);

export const getOrderByNumberThunk = createAsyncThunk(
  'order/getOrderByNumber',
  async (number: number) => {
    return getOrderByNumberApi(number);
  }
);

const initialState: TOrderState = {
  orders: [],
  orderData: null,
  orderModalData: null,
  orderRequest: false,
};

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrderModal: (state) => {
      state.orderModalData = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createOrderThunk.pending, (state) => {
      state.orderRequest = true;
    });
    builder.addCase(createOrderThunk.rejected, (state) => {
      state.orderRequest = false;
    });
    builder.addCase(createOrderThunk.fulfilled, (state, { payload }) => {
      state.orderRequest = false;
      state.orderModalData = payload.order;
    });

    builder.addCase(getOrderByNumberThunk.pending, (state) => {
      state.orderData = null;
    });

    builder.addCase(getOrderByNumberThunk.rejected, (state) => {
      state.orderData = null;
    });

    builder.addCase(getOrderByNumberThunk.fulfilled, (state, { payload }) => {
      state.orderData = payload.orders[0] ?? null;
    });

    builder.addCase(getOrderThunk.fulfilled, (state, { payload }) => {
      state.orders = payload;
    });
  },
});

export default orderSlice.reducer;
export const { clearOrderModal } = orderSlice.actions;
