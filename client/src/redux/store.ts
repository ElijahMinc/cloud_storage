import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import  authSlice  from './slices/AuthSlice';
import  fileSlice  from './slices/FileSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    file: fileSlice
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
