import React from 'react'
import { useAppSelector } from '@hooks/useAppRedux'
import { fileSelector } from '@redux/slices/FileSlice'
import { Alert, AlertIcon, Box, Button, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text } from '@chakra-ui/react'

interface IUploadDrawer {
   onClose: () => void
   isOpen: boolean
}

export const UploadDrawer: React.FC<IUploadDrawer> = ({ onClose, isOpen }) => {
   const { uploadFiles } = useAppSelector(fileSelector)

   return (
      <Drawer
        isOpen={isOpen}
        placement='right'
        onClose={onClose}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Create your account</DrawerHeader>

          <DrawerBody>
            {uploadFiles.map(({id, name, progress}) => (
               <Alert key={`progress-${id}`} status='success'>
                <AlertIcon position="relative" zIndex={1}/>
                  <Text >{name}</Text>
                <Box  
                     position="absolute"
                     top={0}
                     left={0}
                     bg="whiteAlpha.700"
                     height="100%"
                     style={{width: `${progress}%`}} 
                     display="flex"
                     justifyContent="center"
                     alignItems="center"
                  >
                    <Text fontWeight="bold">{progress}%</Text> 
                  </Box>
              </Alert>
            ))}
          </DrawerBody>

          <DrawerFooter>
            <Button variant='outline' mr={3} onClick={onClose}>
              Okey ^^
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      )
}