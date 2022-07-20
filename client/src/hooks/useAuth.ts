import { useMemo } from "react"
import { authSelector } from "@redux/slices/AuthSlice"
import { useAppSelector } from "./useAppRedux"



export const useAuth = () => {
   const { token, user } = useAppSelector(authSelector)

   const TOKEN = useMemo(() => localStorage.getItem('token'), [token]) || token

   return {
      isAuth: !!TOKEN,
      token: TOKEN,
      user
   }
}