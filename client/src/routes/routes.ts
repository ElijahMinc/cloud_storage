import { Login } from "@pages/Login/Login";
import { Register } from "@pages/Login/Register/Register";
import { HomePage } from "@pages/Home/Home";

export const publicRoutes = [
   {
      path: '/register',
      component: Register,
      exact: true,
   },
   {
      path: '/login',
      component: Login,
      exact: true,

   }
]

export const privateRoutes = [
   {
      path: '/',
      component: HomePage,
      exact: true,
   },
]