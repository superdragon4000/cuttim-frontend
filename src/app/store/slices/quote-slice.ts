import {createSlice, type PayloadAction} from '@reduxjs/toolkit';

type QuoteState = {
  fileName?: string;
  materialId?: number;
  quantity: number;
  shippingMethod: 'pickup' | 'courier' | 'express';
};

const initialState: QuoteState = {
  quantity: 1,
  shippingMethod: 'courier',
};

const quoteSlice = createSlice({
  name: 'quote',
  initialState,
  reducers: {
    updateQuote(state, action: PayloadAction<Partial<QuoteState>>) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
});

export const {updateQuote} = quoteSlice.actions;
export default quoteSlice.reducer;
