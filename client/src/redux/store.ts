import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import  authReducer  from './slices/AuthSlice';
import  fileReducer  from './slices/FileSlice';
import  toastReducer  from './slices/ToastSlice';
import  drawerReducer  from './slices/DrawerSlice';



export const store = configureStore({
  reducer: {
    auth: authReducer,
    file: fileReducer,
    toast: toastReducer,
    drawer: drawerReducer
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
