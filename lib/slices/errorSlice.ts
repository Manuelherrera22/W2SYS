import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ErrorState {
  message: string | null;
  inputs: Record<string, any>;
}

const initialState: ErrorState = {
  message: null,
  inputs: {},
};

const errorSlice = createSlice({
  name: 'error',
  initialState,
  reducers: {
    setError: (state, action: PayloadAction<string>) => {
      state.message = action.payload;
    },
    clearError: (state) => {
      state.message = null;
    },
    setInputError: (state, action: PayloadAction<Record<string, any>>) => {
      state.inputs = action.payload;
    },
  },
});

export const { setError, clearError, setInputError } = errorSlice.actions;
export default errorSlice.reducer;



