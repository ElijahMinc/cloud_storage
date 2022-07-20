import React from 'react'
import { AuthForm } from '../../../common/AuthSelector/AuthForm'
import { useAppDispatch, useAppSelector } from '../../../hooks/useAppRedux'
import { authSelector, registerThunk } from '../../../redux/slices/AuthSlice'

interface ILogin {

}

export const Register: React.FC<ILogin> = () => {
   const dispatch = useAppDispatch()
   const {isLoaded} = useAppSelector(authSelector)
   const handleSubmit = (data: any) => {
      dispatch(registerThunk({email: data.emailValue, password: data.passwordValue}))
   }

   return (
      <AuthForm title="Register" onSubmit={handleSubmit}>
         <AuthForm.MInput initial={{ opacity: 0, x: -100}} animate={{ opacity: 1, x: 0}} transition={{delay: .8}} isEmail />
         <AuthForm.MInput initial={{ opacity: 0, x: 100}} animate={{ opacity: 1, x: 0}} transition={{delay: .8}}  isEmail={false} />
         <AuthForm.MButton initial={{ opacity: 0}} animate={{ opacity: 1}} transition={{delay: .8}}/>
      </AuthForm>
   )
}