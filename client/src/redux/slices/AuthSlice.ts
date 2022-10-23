import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios, { AxiosResponse, AxiosError } from "axios"
import ValidationErrors from "axios"
import { AuthState, User, Response } from "@typesModule/types"
import { RootState } from "@redux/store"
import { setToast } from "./ToastSlice"
import { $AuthApi } from "@/http/axios.http"
import { LocalStorageService } from "@/service/LocalStorageService"
import { LocalStorageKeys } from "@/constant"

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem("token"),
  error: "",
  isLoaded: true,
}

export const loginThunk = createAsyncThunk<
  Response<User>,
  Pick<User, "email" | "password">
>("auth/login", async (userData, { dispatch, rejectWithValue }) => {
  try {
    const response: AxiosResponse<Response<User>, any> = await axios.post(
      `${process.env.REACT_APP_API_URL}/auth/login`,
      userData
    )

    dispatch(setToast({ title: `Login is success`, status: "success" }))

    return response.data
  } catch (err) {
    let error = err as AxiosError<{ message: string }> // cast the error for access
    dispatch(
      setToast({
        title: error.response?.data?.message ?? "Error with login",
        status: "error",
      })
    )
    // We got validation errors, let's return those so we can reference in our component and set form errors
    return rejectWithValue(error.response?.data || "Error with login")
  }
})

export const registerThunk = createAsyncThunk<
  Response<User>,
  Pick<User, "email" | "password">
>("auth/register", async (userData, { dispatch, rejectWithValue }) => {
  try {
    const response: AxiosResponse<Response<User>> = await $AuthApi.post(
      "/auth/register",
      userData
    )
    dispatch(setToast({ title: `Register is success`, status: "success" }))

    return response.data
  } catch (err) {
    let error = err as AxiosError<{ message: string }>
    dispatch(
      setToast({
        title: error.response?.data?.message ?? "Error with register",
        status: "error",
      })
    )

    return rejectWithValue(error.response?.data || "Error with register")
  }
})

export const fetchUserThunk = createAsyncThunk<User>(
  "auth/user",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response: AxiosResponse<User> = await $AuthApi.get("/auth/user")

      dispatch(
        setToast({ title: `Hello, ${response.data.email}`, status: "success" })
      )

      return response.data
    } catch (err) {
      console.log(err)
      let error = err as AxiosError<typeof ValidationErrors>
      dispatch(setToast({ title: `Error with Authorization`, status: "error" }))
      if (error.response?.status === 401) {
        LocalStorageService.delete(LocalStorageKeys.TOKEN)
      }
      return rejectWithValue(error.response?.data || "Error fetch user")
    }
  }
)
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    refreshUser(state) {
      state.user = null
      state.token = ""
      localStorage.removeItem("token")
    },
  },
  extraReducers: (build) => {
    build.addCase(loginThunk.fulfilled, (state, action) => {
      state.user = action.payload.user
      state.token = action.payload.token
      state.isLoaded = true

      localStorage.setItem("token", JSON.stringify(action.payload.token))
    })
    build.addCase(loginThunk.pending, (state, action) => {
      state.isLoaded = false
    })
    build.addCase(loginThunk.rejected, (state, action) => {
      state.error = action.error.message || ""
      state.isLoaded = true
    })

    build.addCase(registerThunk.fulfilled, (state, action) => {
      state.user = action.payload.user
      state.token = action.payload.token
      state.isLoaded = true
      localStorage.setItem("token", JSON.stringify(action.payload.token))
    })
    build.addCase(registerThunk.pending, (state, action) => {
      state.isLoaded = false
    })
    build.addCase(registerThunk.rejected, (state, action) => {
      state.error = action.error.message || ""
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
      state.error = action.error.message || ""
      state.isLoaded = true
    })
  },
})

export const { refreshUser } = authSlice.actions

export const authSelector = (state: RootState) => state.auth

export default authSlice.reducer
