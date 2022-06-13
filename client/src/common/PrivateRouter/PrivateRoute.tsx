import React from 'react'
import { Redirect, Route, RouteProps } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'


interface IPrivateRouter extends RouteProps {

}

export const PrivateRoute: React.FC<IPrivateRouter> = (props) => {
   const { isAuth } = useAuth()


   return isAuth ? (
      <Route {...props} />
       ) : (
      <Redirect to="/login" />
      )
}