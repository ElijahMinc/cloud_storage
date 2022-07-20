import { useSelector } from "react-redux"
import { selectToast } from "../../redux/slices/ToastSlice"
import { ToastItem } from "./ToastItem"
import './Toast.css'
import { Stack } from "@chakra-ui/react"

interface ToastProps {

}

export const Toast: React.FC<ToastProps> = () => {
   const { toasts } = useSelector(selectToast)


   return (
      <div className='toast'>
         <Stack  className="toast__list">
            {!!toasts.length && (
               toasts.map(({ id, status, title }) => <ToastItem key={id}  {...{id, status, title }}/>)
            )}
         </Stack >
      </div>
      
      )
}