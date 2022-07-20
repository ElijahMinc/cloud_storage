import {  createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "@redux/store"
import { v4 as uuidv4 } from 'uuid'


type AlertColor = 'success' | 'error'

export interface ToastInterface {
   id: string | number
   title: string
   status: AlertColor
}

interface InitialStateToast {
   toasts: ToastInterface[]
}
export const generateToast = (title: ToastInterface['title'], status: ToastInterface['status']) => ({
   id: uuidv4(),
   title,
   status
})


const initialState: InitialStateToast = {
   toasts: [],
}


export const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
   //  setIsShow(state, { payload }: PayloadAction<boolean>){
   //    state.isShow = payload
   //  },
    setToast(state, { payload }: PayloadAction<Omit<ToastInterface, 'id'>>){
      state.toasts.push(generateToast(payload.title, payload.status))
    },
    removeToast(state, { payload }: PayloadAction<ToastInterface['id']>){
      state.toasts = state.toasts.filter((toast) => toast.id !== payload)
    },
  },
})
const toastReducer = toastSlice.reducer

export const { setToast, removeToast } = toastSlice.actions
export const selectToast = (state: RootState) => state.toast

export default  toastReducer
