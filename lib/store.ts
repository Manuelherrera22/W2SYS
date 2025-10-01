import { configureStore } from '@reduxjs/toolkit';
import languageReducer from './slices/languageSlice';
import dataReducer from './slices/dataSlice';
import modalReducer from './slices/modalSlice';
import errorReducer from './slices/errorSlice';
import loadingReducer from './slices/loadingSlice';

export const store = configureStore({
  reducer: {
    language: languageReducer,
    data: dataReducer,
    modal: modalReducer,
    error: errorReducer,
    loading: loadingReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;



