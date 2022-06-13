import { authSelector } from "../redux/slices/AuthSlice"
import { useAppSelector } from "./useAppRedux"



export const useAuth = () => {
   const { token, user } = useAppSelector(authSelector)

   return {
      isAuth: !!token,
      user
   }
}