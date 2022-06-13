import React from 'react'
import { Redirect, Route, RouteProps } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

interface ILoginRoute extends  RouteProps {

}

export const LoginRoute: React.FC<ILoginRoute> = (props) => {
   const { isAuth } = useAuth()

   return isAuth ? (
      <Redirect to="/" />

       ) : (
         <Route {...props} />
      )
}