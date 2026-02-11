'use client';

import {configureStore} from '@reduxjs/toolkit';
import quoteReducer from './slices/quote-slice';
import authReducer from './slices/auth-slice';

export const store = configureStore({
  reducer: {
    quote: quoteReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
