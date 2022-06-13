import React, { ReactNode, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import './Modal.css'
interface IModal {
   onSubmit: () => void
   isShow: boolean
   onClose: () => void
   title: string
   children: ReactNode
} 

const MODAL_ROOT_ELEMENT = document.querySelector('#modal')!

export const Modal: React.FC<IModal> = ({ onSubmit, isShow, onClose, title, children}) => {

   const modal = useMemo(() => {
         const modalElement = document.createElement('div');

         return modalElement
   }, [])

   useEffect(() => {
      if(isShow){
         MODAL_ROOT_ELEMENT.appendChild(modal)

         return  () => {
            MODAL_ROOT_ELEMENT.removeChild(modal)
         }
      }
   }, [isShow])


   if(!isShow){
      return null
   }

   return createPortal(
      <div className='modal'>
         <div className="modal__container">
            <div className="modal__header">
               <h3>{title}</h3>
            </div>
            <div className="modal__body">
               {children}
            </div>
            <div className="modal__footer">
               <button onClick={onSubmit}>
                  Create
               </button>
               <button onClick={onClose}>
                  Close
               </button>
            </div>
         </div>
      </div>,
      modal
      )
}