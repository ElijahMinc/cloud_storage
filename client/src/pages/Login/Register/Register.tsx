import React from 'react'
import { AuthForm } from '../../../common/AuthSelector/AuthForm'
import { useAppDispatch } from '../../../hooks/useAppRedux'
import { registerThunk } from '../../../redux/slices/AuthSlice'

interface ILogin {

}

export const Register: React.FC<ILogin> = () => {
   const dispatch = useAppDispatch()

   const handleSubmit = (data: any) => {
      dispatch(registerThunk({email: data.emailValue, password: data.passwordValue}))
   }

   return (
      <AuthForm title="Register" onSubmit={handleSubmit}>
         <AuthForm.Input isEmail />
         <AuthForm.Input isEmail={false} />
         <AuthForm.Button />
      </AuthForm>
   )
}