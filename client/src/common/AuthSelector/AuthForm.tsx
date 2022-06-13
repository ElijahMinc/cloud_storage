import React, { useCallback, useMemo, useState } from 'react'
import { AuthContext } from './Context/AuthContext'
import { Auth } from './types/types'
import { Input } from './Input/Input'
import { Button } from './Button/Button'

interface ThemedForm {
   children: React.ReactNode
   title?: string
   onSubmit: (data: any) => void
}

export const AuthForm = ( { children,title, onSubmit }: ThemedForm ) => {

   const [ emailValue, setEmailData ] = useState('')
   const [ passwordValue, setPasswordValue ] = useState('')

   const handleChangeEmail = useCallback((value: string) => {
      setEmailData(value)
   },[emailValue])
   
   const handleChangePassword = useCallback((value: string) => {
      setPasswordValue(value)
   }, [passwordValue])

   const onSubmitHandle = (e: React.FormEvent<HTMLFormElement>) => {
       e.preventDefault()
       const data = {
         emailValue,
         passwordValue
       }

       onSubmit(data)
   }

   const value = useMemo(() => ({
      emailValue,
      passwordValue,
      handleChangeEmail,
      handleChangePassword
   }), [emailValue, passwordValue])

   return (
      <form className='form' onSubmit={onSubmitHandle}>
         <div className='auth'>
            {title && <h2>{title}</h2>}
            <AuthContext.Provider value={value}>
                  {children}
            </AuthContext.Provider>
         </div>
      </form>
   )
}

AuthForm.Input = Input
AuthForm.Button = Button