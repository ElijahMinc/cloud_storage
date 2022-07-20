import React, { forwardRef, useState } from 'react'
import { useAuthSelector} from '../Context/AuthContext'
import {
   FormControl,
   FormLabel,
   FormErrorMessage,
   FormHelperText,
   Input,
 } from '@chakra-ui/react'
import { motion } from 'framer-motion'

interface IInput{
   isEmail: boolean
}

export const CustomInput: React.FC<any> = forwardRef<any, any>(({ isEmail = true }, ref) => {

   const {  emailValue,
      passwordValue,
      handleChangeEmail,
      handleChangePassword  } = useAuthSelector()

   return  (
      <FormControl ref={ref}>
          <FormLabel>{isEmail ? 'Your Email' : 'Your Password'}</FormLabel>
            {isEmail ? (
               
               <Input
                  type="email"
                  value={emailValue}
                  onChange={(e) => handleChangeEmail(e.target.value)}
                  placeholder="Please enter your email"
            /> 
            ) : (
               <Input
                  type="password"
                  value={passwordValue}
                  onChange={(e) => handleChangePassword(e.target.value)}
                  placeholder="Please enter your password"
               />
            )}
      </FormControl>
   )
})

export const MCustomInput = motion(CustomInput)