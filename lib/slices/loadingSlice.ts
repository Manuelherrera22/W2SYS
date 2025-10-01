import { createSlice } from '@reduxjs/toolkit';

interface LoadingState {
  open: boolean;
}

const initialState: LoadingState = {
  open: false,
};

const loadingSlice = createSlice({
  name: 'loading',
  initialState,
  reducers: {
    handleOpenLoading: (state) => {
      state.open = true;
    },
    handleCloseLoading: (state) => {
      state.open = false;
    },
  },
});

export const { handleOpenLoading, handleCloseLoading } = loadingSlice.actions;
export default loadingSlice.reducer;



