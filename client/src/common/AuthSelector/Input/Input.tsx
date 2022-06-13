import React, { useState } from 'react'
import { useAuthSelector} from '../Context/AuthContext'


interface IInput{
   isEmail: boolean
}

export const Input: React.FC<IInput> = ({ isEmail = true }) => {

   const {  emailValue,
      passwordValue,
      handleChangeEmail,
      handleChangePassword  } = useAuthSelector()

   return  (
      <div className='auth__item'>
            {isEmail ? (
               <input
               type="email"
               value={emailValue}
               onChange={(e) => handleChangeEmail(e.target.value)}
               placeholder="Please enter your email"
            /> 
            ) : (
               <input
                  type="password"
                  value={passwordValue}
                  onChange={(e) => handleChangePassword(e.target.value)}
                  placeholder="Please enter your password"
               />
            )}
      </div>
   )
}