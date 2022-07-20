import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from '@chakra-ui/react'
import React, { ReactNode, useEffect, useMemo, useRef, useState } from 'react'
interface IModal {
   onSubmit: () => void
   onClose: () => void
   isOpen: boolean
   title: string
   children: ReactNode
} 


export const CustomModal: React.FC<IModal> = ({ onSubmit, isOpen, onClose, title, children}) => {
   const initialRef = React.useRef(null)
   const finalRef = React.useRef(null)
   return (
      <Modal
         initialFocusRef={initialRef}
         finalFocusRef={finalRef}
         isOpen={isOpen}
         onClose={onClose}
      >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
               {children}
        </ModalBody>

        <ModalFooter>
          <Button colorScheme='blue' mr={3} onClick={onSubmit}>
            Save
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
   )
   // createPortal(
   //    <div className='modal'>
   //       <div className="modal__container">
   //          <div className="modal__header">
   //             <h3>{title}</h3>
   //          </div>
   //          <div className="modal__body">
   //             {children}
   //          </div>
   //          <div className="modal__footer">
   //             <button onClick={onSubmit}>
   //                Create
   //             </button>
   //             <button onClick={onClose}>
   //                Close
   //             </button>
   //          </div>
   //       </div>
   //    </div>,
   //    modal
   //    )
}