import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import {
  loginUserApi,
  registerUserApi,
  getUserApi,
  updateUserApi,
  logoutApi,
} from '../../utils/burger-api';
import { setCookie, deleteCookie } from '../../utils/cookie';

import type { TUserState } from '../../utils/types';

export const logoutUserThunk = createAsyncThunk('user/logout', async () => {
  await logoutApi();
  deleteCookie('accessToken');
  localStorage.removeItem('refreshToken');
});

export const getUserThunk = createAsyncThunk('user/getUser', async () => {
  return getUserApi();
});

export const updateUserThunk = createAsyncThunk(
  'user/update',
  async (data: { email?: string; name?: string; password?: string }) => {
    return updateUserApi(data);
  }
);

export const loginUserThunk = createAsyncThunk(
  'user/login',
  async (data: { email: string; password: string }) => {
    const response = await loginUserApi(data);

    setCookie('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);

    return response;
  }
);

export const registerUserThunk = createAsyncThunk(
  'user/registrate',
  async (data: { email: string; name: string; password: string }) => {
    const response = await registerUserApi(data);

    setCookie('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);

    return response;
  }
);

const initialState: TUserState = {
  user: null,
  isLoading: false,
  isAuthChecked: false,
  error: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getUserThunk.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getUserThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.user = null;
      state.error = action.error;
      state.isAuthChecked = true;
    });
    builder.addCase(getUserThunk.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.user = payload.user;
      state.isAuthChecked = true;
      state.error = null;
    });
    builder.addCase(loginUserThunk.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(loginUserThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.user = null;
      state.error = action.error;
      state.isAuthChecked = true;
    });
    builder.addCase(loginUserThunk.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.user = payload.user;
      state.isAuthChecked = true;
    });

    builder.addCase(registerUserThunk.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(registerUserThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.user = null;
      state.error = action.error;
      state.isAuthChecked = true;
    });
    builder.addCase(registerUserThunk.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.user = payload.user;
      state.isAuthChecked = true;
    });

    builder.addCase(updateUserThunk.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(updateUserThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error;
    });
    builder.addCase(updateUserThunk.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.user = payload.user;
    });
    builder.addCase(logoutUserThunk.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });

    builder.addCase(logoutUserThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error;
    });

    builder.addCase(logoutUserThunk.fulfilled, (state) => {
      state.isLoading = false;
      state.user = null;
      state.isAuthChecked = true;
      state.error = null;
    });
  },
});

export default userSlice.reducer;
