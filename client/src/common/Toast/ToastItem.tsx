import { useEffect, useRef, useState } from "react"
import { useDispatch } from "react-redux"
import { useHover } from "../../hooks/useHover"
import { useSkipFirstMount } from "../../hooks/useSkipFirstMount"
import { removeToast } from "../../redux/slices/ToastSlice"
import {motion} from 'framer-motion'
import { Alert, AlertDescription, AlertIcon, CloseButton } from "@chakra-ui/react"



interface ToastItemProps {}

export const ToastItem: React.FC<any> = ({ id, status, title }) => {
   const [isClosing, setIsClosing] = useState(false)

   const alertRef = useRef<any>()
   const timeoutRef = useRef<NodeJS.Timeout>()
   
   const isHovering = useHover(alertRef)
   const dispatch = useDispatch()



   useEffect(() => {

      timeoutRef.current = setTimeout(() => {
         timeoutRef.current = setTimeout(() => dispatch(removeToast(id)) , 3000)
         setIsClosing(true)
      }, 2000)

      return () => {
         clearTimeout(timeoutRef.current)
      }
   }, [])

   useSkipFirstMount(() => {
      if(isHovering) {
         setIsClosing(false)
         clearTimeout(timeoutRef.current)

      }else{
         setIsClosing(true)
         timeoutRef.current = setTimeout(() => dispatch(removeToast(id)) , 3000)
      }

   }, [isHovering])

   return (
      <Alert ref={alertRef} status={status} borderRadius="md" variant='solid' w={300} display="flex" justifyContent="space-between">
         <AlertIcon />
         <AlertDescription>
            {title}
         </AlertDescription>

         <CloseButton
            right={-1}
            top={-1}
            onClick={() => dispatch(removeToast(id))}
         />
      </Alert>
      )
}