import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import  authReducer  from './slices/AuthSlice';
import  fileReducer  from './slices/FileSlice';
import  toastReducer  from './slices/ToastSlice';
import  drawerReducer  from './slices/DrawerSlice';
import  modalReducer  from './slices/ModalSlice';



export const store = configureStore({
  reducer: {
    auth: authReducer,
    file: fileReducer,
    toast: toastReducer,
    drawer: drawerReducer,
    modal: modalReducer
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
