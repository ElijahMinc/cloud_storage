import React from "react"
import { AuthForm } from "../../common/AuthSelector/AuthForm"
import { useAppDispatch, useAppSelector } from "../../hooks/useAppRedux"
import { authSelector, loginThunk } from "../../redux/slices/AuthSlice"

import "./Auth.css"

export const Login: React.FC = () => {
  const dispatch = useAppDispatch()
  const { isLoaded } = useAppSelector(authSelector)

  const handleSubmit = (data: any) => {
    if (!data.emailValue || !data.passwordValue) return
    dispatch(
      loginThunk({ email: data.emailValue, password: data.passwordValue })
    )
  }

  return (
    <AuthForm title="login" onSubmit={handleSubmit}>
      <AuthForm.MInput
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8 }}
        isEmail
      />
      <AuthForm.MInput
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8 }}
        isEmail={false}
      />
      <AuthForm.MButton
        isDisabled={!isLoaded}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      />
    </AuthForm>
  )
}
