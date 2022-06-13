import React, { BaseSyntheticEvent, FormEventHandler, ReactEventHandler, useState } from 'react'
import { useDispatch } from 'react-redux'
import { AuthForm } from '../../common/AuthSelector/AuthForm'
import { useAppDispatch } from '../../hooks/useAppRedux'
import { loginThunk } from '../../redux/slices/AuthSlice'

import './Auth.css'
interface ILogin {
   // isRegister: boolean
}

export const Login: React.FC<ILogin> = () => {
   const dispatch = useAppDispatch()

   const handleSubmit = (data: any) => {
      dispatch(loginThunk({email: data.emailValue, password: data.passwordValue}))
   }

   return (
      <AuthForm title="Login" onSubmit={handleSubmit}>
         <AuthForm.Input isEmail />
         <AuthForm.Input isEmail={false} />
         <AuthForm.Button />
      </AuthForm>
   )
}