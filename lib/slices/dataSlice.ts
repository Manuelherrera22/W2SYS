import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DataState {
  values: any;
  dataTable: Record<string, any>;
  dataInputs: Record<string, any>;
}

const initialState: DataState = {
  values: null,
  dataTable: {},
  dataInputs: {},
};

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<any>) => {
      state.values = action.payload;
    },
    clearData: (state) => {
      state.values = null;
    },
    clearDataInputs: (state) => {
      state.dataInputs = {};
    },
    setDataTable: (state, action: PayloadAction<Record<string, any>>) => {
      state.dataTable = action.payload;
    },
    setInputs: (state, action: PayloadAction<Record<string, any>>) => {
      state.dataInputs = { ...state.dataInputs, ...action.payload };
    },
  },
});

export const { clearData, clearDataInputs, setData, setDataTable, setInputs } = dataSlice.actions;
export default dataSlice.reducer;



