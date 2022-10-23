import { useTranslate } from "@/hooks/useTranslations"
import { selectModal } from "@/redux/slices/ModalSlice"
import {
  Button,
  Modal,
  ModalBody,
  ModalBodyProps,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalHeaderProps,
  ModalOverlay,
  ModalProps,
} from "@chakra-ui/react"
import React, { ReactNode } from "react"
import { useSelector } from "react-redux"

interface IModal extends ModalProps {
  onSubmit: () => void
  onClose: () => void
  isOpen: boolean
  title: string
  children: ReactNode
  modalBodyProps?: ModalBodyProps
  withFooter?: boolean
}

export const CustomModal: React.FC<IModal> = ({
  onSubmit,
  isOpen,
  onClose,
  title,
  children,
  size,
  modalBodyProps,
  withFooter = true,
}) => {
  const initialRef = React.useRef(null)
  const finalRef = React.useRef(null)
  const { t } = useTranslate()
  return (
    <Modal
      initialFocusRef={initialRef}
      finalFocusRef={finalRef}
      isOpen={isOpen}
      onClose={onClose}
      size={size}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody {...modalBodyProps} pb={6}>
          {children}
        </ModalBody>
        {withFooter && (
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onSubmit}>
              {t("save")}
            </Button>
            <Button onClick={onClose}>{t("cancel")}</Button>
          </ModalFooter>
        )}
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
