import { defaultQueryParams } from '@helpers/getQueryParams';
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import axios, { AxiosResponse, AxiosError, } from 'axios'
import { FileProgress, FileState, Filter, IFile, ParentDir, QueryParams } from "@typesModule/types"
import { RootState } from "@redux/store"
import { fetchUserThunk } from './AuthSlice';
import { setToast } from './ToastSlice';


interface DrawerState{
   isOpen: boolean
}

const initialState: DrawerState = {
   isOpen: false
 }
 

 export const drawerSlice = createSlice({
   name: 'drawer',
   initialState,
   reducers: {
      setOpen(state){
         state.isOpen = true
      },
      setClose(state){
         state.isOpen = false
      },
   }
 })

export  const { setClose, setOpen } = drawerSlice.actions

 
export const drawerSelector = (state: RootState) => state.drawer

export default drawerSlice.reducer