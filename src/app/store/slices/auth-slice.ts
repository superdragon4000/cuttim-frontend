import {createSlice, type PayloadAction} from '@reduxjs/toolkit';
import type {UserProfile} from '@/entities/user';

type AuthState = {
  accessToken: string | null;
  user: UserProfile | null;
};

const initialState: AuthState = {
  accessToken: null,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth(state, action: PayloadAction<AuthState>) {
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user;
    },
    clearAuth(state) {
      state.accessToken = null;
      state.user = null;
    },
  },
});

export const {setAuth, clearAuth} = authSlice.actions;
export default authSlice.reducer;
