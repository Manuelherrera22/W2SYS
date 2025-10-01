import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ModalState {
  isOpen: boolean;
  variant: 'normal' | 'success' | 'warning' | 'danger';
  title: string | null;
  message: string | null;
}

const initialState: ModalState = {
  isOpen: false,
  variant: 'normal',
  title: null,
  message: null,
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal: (state, action: PayloadAction<{ variant?: string; title?: string; message?: string }>) => {
      state.isOpen = true;
      state.variant = (action.payload.variant as any) || 'normal';
      state.title = action.payload.title || state.title;
      state.message = action.payload.message || state.message;
    },
    closeModal: (state) => {
      state.isOpen = false;
    },
    handleCloseModal: (state) => {
      state.isOpen = false;
    },
    resetModal: (state) => {
      state.isOpen = false;
      state.variant = 'normal';
      state.title = null;
      state.message = null;
    },
  },
});

export const { openModal, closeModal, handleCloseModal, resetModal } = modalSlice.actions;
export default modalSlice.reducer;



