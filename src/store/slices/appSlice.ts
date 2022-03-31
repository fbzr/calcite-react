import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../index';

interface AppState {
  title: string;
  loading: boolean;
  selectedObjectId?: any;
}

const initialState: AppState = {
  title: '',
  loading: true,
};

const appSlice = createSlice({
  name: 'appSlice',
  initialState,
  reducers: {
    setTitle: (state: AppState, action: PayloadAction<AppState['title']>) => {
      state.title = action.payload;
    },
    setLoading: (
      state: AppState,
      action: PayloadAction<AppState['loading']>
    ) => {
      state.loading = action.payload;
    },
    setSelectedObjectId: (
      state: AppState,
      action: PayloadAction<AppState['selectedObjectId']>
    ) => {
      state.selectedObjectId = action.payload;
    },
  },
});

// Export actions
export const { setTitle, setLoading, setSelectedObjectId } = appSlice.actions;

// Export individual pieces of state
export const $title = (state: RootState) => state.appReducer.title;
export const $loading = (state: RootState) => state.appReducer.loading;
export const $selectedObjectId = (state: RootState) =>
  state.appReducer.selectedObjectId;

//Export default slice's reducer
export default appSlice.reducer;
