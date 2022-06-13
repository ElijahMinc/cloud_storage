import { Action, createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import axios, { AxiosResponse, AxiosError, } from 'axios'
import ValidationErrors from 'axios'
import { AuthState, User, Response } from "../../types/types"
import { RootState } from "../store"




const initialState: AuthState = {
   user: null,
   token: localStorage.getItem('token'),
   error: '',
   isLoaded: false
 }
 
export const loginThunk = createAsyncThunk<Response<User>, Pick<User, 'email' | 'password'>>('auth/login', async (userData, { rejectWithValue }) => {

    try {
        const response: AxiosResponse<Response<User>, any> = await axios.post('http://localhost:1998/auth/login', userData)
        console.log('response', response)

        return response.data

    } catch (err) {
     console.log(err)
      let error = err as AxiosError<typeof ValidationErrors> // cast the error for access
      // We got validation errors, let's return those so we can reference in our component and set form errors
      return rejectWithValue(error.response?.data || 'Error with login')
    }
  }
)

export const registerThunk = createAsyncThunk<Response<User>, Pick<User, 'email' | 'password'>>('auth/register', async (userData, { rejectWithValue }) => {

  try {
      const response: AxiosResponse<Response<User>> = await axios.post('http://localhost:1998/auth/register', userData)
    console.log('response', response)
      return response.data

  } catch (err) {
    console.log(err)

    let error = err as AxiosError<typeof ValidationErrors>

    return rejectWithValue(error.response?.data || 'Error with register')
  }
}
)

export const fetchUserThunk = createAsyncThunk<User>('auth/user', async (_, { rejectWithValue }) => {

  try {
      const response: AxiosResponse<User> = await axios.get('http://localhost:1998/auth/user', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      return response.data

  } catch (err) {
    console.log(err)

    let error = err as AxiosError<typeof ValidationErrors>

    return rejectWithValue(error.response?.data || 'Error fetch user')
  }
}
)
 export const authSlice = createSlice({
   name: 'auth',
   initialState,
   reducers: {
     refreshUser(state){
         state.user = null;
         state.token = '';
         localStorage.removeItem('token');
     }
   },
   extraReducers: (build) => {
      build.addCase(loginThunk.fulfilled, (state, action) => {
        state.user = action.payload.user
        state.token = action.payload.token
        state.isLoaded = true

        console.log(action.payload)
        localStorage.setItem('token', action.payload.token)
      })
      build.addCase(loginThunk.pending, (state, action) => {
        state.isLoaded = false
      })
      build.addCase(loginThunk.rejected, (state, action) => {
          state.error = action.error.message || ''
          state.isLoaded = true
      })

      build.addCase(registerThunk.fulfilled, (state, action) => {
        state.user = action.payload.user
        state.token = action.payload.token
        state.isLoaded = true
        localStorage.setItem('token', action.payload.token)
      })
      build.addCase(registerThunk.pending, (state, action) => {
        state.isLoaded = false
      })
      build.addCase(registerThunk.rejected, (state, action) => {
        state.error = action.error.message || ''
        state.isLoaded = true
      })

      build.addCase(fetchUserThunk.fulfilled, (state, action) => {
        state.user = action.payload
        state.isLoaded = true
      })
      build.addCase(fetchUserThunk.pending, (state, action) => {
        state.isLoaded = false

      })
      build.addCase(fetchUserThunk.rejected, (state, action) => {
        state.error = action.error.message || ''
        state.isLoaded = true
      })
   }
 })

 export const { refreshUser } = authSlice.actions
 
export const authSelector = (state: RootState) => state.auth

 export default authSlice.reducer