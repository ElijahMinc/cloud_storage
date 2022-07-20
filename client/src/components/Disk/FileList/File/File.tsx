import React, { forwardRef } from 'react'
import dirImg from '@assets/imgs/folder.png'
import fileImg from '@assets/imgs/file.png'
import { deleteFile, downloadFile, setCurrentDir, setParentId } from '@redux/slices/FileSlice'
import { useAppDispatch } from '@hooks/useAppRedux'
import { getSizeFormat } from '@helpers/getSize'
import {motion} from 'framer-motion'
import { DeleteIcon } from '@chakra-ui/icons'

import './File.css'

//IFile
export const File: React.FC<any> = forwardRef<any,any>(({date, name, size, type, _id }, ref) => {
   const dispatch = useAppDispatch()

   return (
      <div ref={ref} className={`file ${type !== 'dir' ? 'no-dir' : ''}`} onClick={() => {
         if(type !== 'dir') return
         dispatch(setParentId(_id))
         dispatch(setCurrentDir(_id))
      }}>
         <div className="file__item">
          {type === 'dir' ? (
            <img src={dirImg} alt="folder"/>
          )
         : (
            <img src={fileImg} alt="file"/>
         )}  
         </div>
         <div className="file__item">
            {name}
         </div>
         <div className={`file__item download ${type === 'dir' ? 'touch' : ''}`} onClick={() => dispatch(downloadFile({_id, type, name}))}>
            {type !== 'dir' && 'Download' }
         </div>
         <div className="file__item">
            <DeleteIcon onClick={(e) => {
               e.stopPropagation()
               dispatch(deleteFile(_id))
            }} className="cart" />
         </div>
         <div className="file__item">
            {new Date(date).toLocaleDateString()}
         </div>
         <div className="file__item">
            {getSizeFormat(size)}
         </div>
      </div>
      )
})


export const MFile = motion(File)