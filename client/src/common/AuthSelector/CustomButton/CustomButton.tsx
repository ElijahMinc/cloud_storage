import { Button, FormControl } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import React from 'react'
import { forwardRef } from 'react'



export const CustomButton: React.FC<any> = forwardRef<any, any>(({ isDisabled, ...rest }, ref) => {
   return (
      <FormControl display="flex" justifyContent="flex-end">
         <Button ref={ref} colorScheme="blue"  type='submit' {...rest} isDisabled={isDisabled}>Submit</Button>
      </FormControl>
      )
})


export const MCustomButton = motion(CustomButton)