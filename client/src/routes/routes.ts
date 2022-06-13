import { Login } from "../pages/Login/Login";
import { Register } from "../pages/Login/Register/Register";
import { HomePage } from "../pages/Home/Home";

export const routes = [
   {
      path: '/',
      component: HomePage,
      exact: true,
      auth: true
   },
   {
      path: '/register',
      component: Register,
      exact: true,
      auth: false
   },
   {
      path: '/login',
      component: Login,
      exact: true,
      auth: false

   }
]