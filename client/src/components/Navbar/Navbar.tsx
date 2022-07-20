import { Button, FormControl, FormLabel, Input, InputGroup, InputLeftElement, Stack, Text, useDisclosure } from '@chakra-ui/react'
import React, {  useRef, useState } from 'react'
import { defaultFilters } from '@helpers/getFilters'
import { setFirstWordToUppercase } from '@helpers/setFirstWordToUppercase'
import { useAppDispatch, useAppSelector } from '@hooks/useAppRedux'
import { createFolder, fileSelector, setCurrentDir, setFilterValue, setRefreshFilesUpload, setSearchValue, setSortValue, setUpdatedParentDirsOfId, uploadFile } from '@redux/slices/FileSlice'
import { Filter, QueryParams } from '@typesModule/types'
import { UploadModal } from '@components/UploadModal/UploadModal'
import { Select } from '@chakra-ui/react'
import { SearchIcon } from '@chakra-ui/icons'

import './Navbar.css'
import { CustomModal } from '../../common/Modal/Modal'


export const Navbar: React.FC = () => {
   const { onOpen, onClose, isOpen } = useDisclosure()

   const inputUploadFileRef = useRef<HTMLInputElement>(null)
   const [isShowUploadModal, setUploadModal] = useState(false)
   const [modalValue, setModalValue] = useState('')

   const dispatch = useAppDispatch()
   const [filter, setFilter] = useState<Filter>(defaultFilters[0])
   const [sort, setSort] = useState<QueryParams['sort']>('asc')

   const { currentDir, parentDirs } = useAppSelector(fileSelector)


   const handleBack = () => {
      if(currentDir){
         const indexDir = parentDirs.indexOf(currentDir)
         const prevDirId = parentDirs[indexDir - 1]
         const newParentDirs = [...parentDirs]
         
         newParentDirs.splice(newParentDirs.length - 1, 1)

     
         dispatch(setCurrentDir(prevDirId))
         dispatch(setUpdatedParentDirsOfId(newParentDirs))
      }
   } 

   const handleUploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
      if(e.target.files && inputUploadFileRef.current){
         setUploadModal(true)
         dispatch(setRefreshFilesUpload())

         const files = Array.from(e.target.files)

         files.forEach((file) => {
            const fileData: {  file: File, parentId?: string } = { file }

            if(currentDir){
               fileData.parentId = currentDir
            }

            dispatch(uploadFile(fileData))
         })

         inputUploadFileRef.current.value = ''
      }
      
      
   }

   const handleSubmitModal = () => {
      const createFolderData: {
         name: string,
         parentId?: string
      } = {
         name: modalValue
      }
      if(currentDir){
         createFolderData.parentId = currentDir
      }
      dispatch(createFolder(createFolderData))
      setModalValue('')
      onClose()
   }

   const handleSearchValue = () => {
 
      let timeout:  NodeJS.Timeout;

      return (e: React.ChangeEvent<HTMLInputElement>) => {
         if(!!timeout){
            clearTimeout(timeout)
         }
   
         timeout = setTimeout(() => {
            dispatch(setSearchValue(e.target.value))
   
         }, 500)
      }
   }


   return (
      <nav className='navbar'>
         <div className='navbar__item'> 
            {!!parentDirs.length && (
            <Button colorScheme='blue' size='xs' onClick={handleBack}>
               Back
            </Button>
            )}
          
            <Button colorScheme='blue' width="200px"  onClick={onOpen}>
               Create New Folder
            </Button>
            <Button  colorScheme='blue' position='relative' width="200px" >
               <FormLabel display="flex" justifyContent="center" alignItems="center" m={0} top="0" left="0" right="0" bottom="0" colorScheme='blue' htmlFor='file' cursor="pointer" position="absolute">
                  Upload File
                  <input ref={inputUploadFileRef} id='file' multiple onChange={handleUploadFile} type="file" />
               </FormLabel>
            </Button>
          
         </div>
         <div className='navbar__item'>
            <InputGroup>
               <InputLeftElement
                  pointerEvents='none'
                  children={<SearchIcon color='gray.300' />}
               />
            <Input type="text" variant='flushed' onChange={handleSearchValue()}  placeholder='Search file...'/>

            </InputGroup>
         </div>
         <div className='navbar__item' style={{flexDirection: 'column'}}>
            <Text fontSize={'2xl'} color="primary.500" mb={2}>Sort By:</Text>
            <Stack spacing={2}>
               
               <Select value={filter.id} onChange={(e) => {
                  const choosedOption = defaultFilters.find((filter) => filter.id === +e.target.value)
                  if (choosedOption){
                     setFilter(choosedOption)
                     dispatch(setFilterValue(choosedOption))
                  }
               }}>
                  {defaultFilters.map(({id, value}) => (
                     <option key={id} value={id}>{setFirstWordToUppercase(value)}</option>

                  ))}
               </Select>
               <Select value={sort} onChange={(e) => {
                     const sortValue = e.target.value as QueryParams['sort']
                     setSort(sortValue)
                     dispatch(setSortValue(sortValue))
               }}>
                  <option value='asc'>{setFirstWordToUppercase('asc')}</option>
                  <option value='desc'>{setFirstWordToUppercase('desc')}</option>
               </Select>
            </Stack>
         </div>
         <CustomModal title='Create New Folder' isOpen={isOpen} onClose={onClose}  onSubmit={handleSubmitModal}>
            <FormControl mt={4}>
              <FormLabel>Folder Name</FormLabel>
              <Input
                  type="text"
                  value={modalValue}
                  onChange={(e) => setModalValue(e.target.value)}
                  placeholder="Введите имя папки"
               />
            </FormControl>
         </CustomModal>
          {isShowUploadModal && (
            <UploadModal onClose={() => setUploadModal(false)}/>  
          )}

      </nav>
      )
}