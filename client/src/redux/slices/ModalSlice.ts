import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "@redux/store"

export interface InitialStateModal {
  isOpen: boolean
}

const initialState: InitialStateModal = {
  isOpen: false,
}

export const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    setOpen(state) {
      state.isOpen = true
    },
    setClose(state) {
      state.isOpen = false
    },
  },
})
const modalReducer = modalSlice.reducer

export const { setOpen, setClose } = modalSlice.actions
export const selectModal = (state: RootState) => state.modal

export default modalReducer
