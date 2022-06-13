import React, { ReactEventHandler, useCallback, useRef, useState } from 'react'
import { Modal } from '../../common/Modal/Modal'
import { defaultFilters } from '../../helpers/getFilters'
import { defaultQueryParams } from '../../helpers/getQueryParams'
import { setFirstWordToUppercase } from '../../helpers/setFirstWordToUppercase'
import { useAppDispatch, useAppSelector } from '../../hooks/useAppRedux'
import { createFolder, fileSelector, setCurrentDir, setFilterValue, setRefreshFilesUpload, setSearchValue, setSortValue, setUpdatedParentDirsOfId, uploadFile } from '../../redux/slices/FileSlice'
import { Filter, QueryParams } from '../../types/types'
import { UploadModal } from '../UploadModal/UploadModal'
import './Navbar.css'


export const Navbar: React.FC = () => {
   const inputUploadFileRef = useRef<HTMLInputElement>(null)
   const [isShowUploadModal, setUploadModal] = useState(false)
   const [modalValue, setModalValue] = useState('')
   const [isShowModal, setShowModal] = useState(false)
   const dispatch = useAppDispatch()
   const [filter, setFilter] = useState<Filter>(defaultFilters[0])
   const [sort, setSort] = useState<QueryParams['sort']>('asc')

   const { currentDir, parentDirs } = useAppSelector(fileSelector)

   const handleCloseModal = useCallback(() => setShowModal(false),[])

   const handleShowModal = useCallback(() => setShowModal(true),[])

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
      setShowModal(false)
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
               <button className='navbar__button' onClick={handleBack}>
               Back
            </button>
            )}
          
            <button className='navbar__button' onClick={handleShowModal}>
               Create New Folder
            </button>
            <label className='navbar__button' htmlFor='file'>
               Upload File
               <input ref={inputUploadFileRef} id='file' multiple onChange={handleUploadFile} type="file" />
            </label>
         </div>
         <div className='navbar__item'>
            <input type="text" onChange={handleSearchValue()} placeholder='Search file...'/>
         </div>
         <div className='navbar__item'>
            <div className="sort-group">
               <select value={filter.id} onChange={(e) => {
                  console.log(e.target.value)
                  const choosedOption = defaultFilters.find((filter) => filter.id === +e.target.value)
                  if (choosedOption){
                     setFilter(choosedOption)
                     dispatch(setFilterValue(choosedOption))
                  }
               }}>
                  {defaultFilters.map(({id, value}) => (
                     <option value={id}>{setFirstWordToUppercase(value)}</option>

                  ))}
               </select>
            </div>
            <div className="sort-group">
               <select value={sort} onChange={(e) => {
                     const sortValue = e.target.value as QueryParams['sort']
                     setSort(sortValue)
                     dispatch(setSortValue(sortValue))
               }}>
                  <option value='asc'>{setFirstWordToUppercase('asc')}</option>
                  <option value='desc'>{setFirstWordToUppercase('desc')}</option>
               </select>
            </div>
            <div className="group">
               
            </div>
         </div>
         <Modal title='Create New Folder' isShow={isShowModal} onClose={handleCloseModal} onSubmit={handleSubmitModal}>
            <div className='modal__input'>
               <input
                  type="text"
                  value={modalValue}
                  onChange={(e) => setModalValue(e.target.value)}
                  placeholder="Введите имя папки"
               />
            </div>
          
            
         </Modal>
          {isShowUploadModal && (
            <UploadModal onClose={() => setUploadModal(false)}/>  
          )}

      </nav>
      )
}