import React, { useEffect } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../hooks/useAppRedux'
import { useAuth } from '../../hooks/useAuth'
import { authSelector, fetchUserThunk } from '../../redux/slices/AuthSlice'
import { privateRoutes, publicRoutes } from '../../routes/routes'
import { Loader } from '../Loader/Loader'

export const AppRouter = () => {
   const { isAuth, token} = useAuth()
   const dispatch = useAppDispatch()
   const {isLoaded} = useAppSelector(authSelector)
 
   useEffect(() => {
     if(!!token){
        dispatch(fetchUserThunk(token))
     }
  }, [])
   
   return isAuth ? (
           <Switch>
            {!isLoaded ? <Loader/> : (
               privateRoutes.map(({component, exact, path}) => (
                  <Route key={`route-${path}`} component={component} path={path} exact={exact}/>
               ))
            )}
            <Redirect to='/' />
         </Switch>
   ) : (
      <Switch>
            {publicRoutes.map(({component, exact, path}) => (
               <Route key={`route-${path}`} component={component} path={path} exact={exact}/>
            ))}
            <Redirect to='/login' />
      </Switch>
   )
}