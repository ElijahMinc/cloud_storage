import React from 'react'
import { IFile } from '../../../../types/types'
import dirImg from '../../../../assets/imgs/folder.png'
import fileImg from '../../../../assets/imgs/file.png'
import deleteImg from '../../../../assets/imgs/delete.png'

import './File.css'
import { deleteFile, downloadFile, setCurrentDir, setParentId } from '../../../../redux/slices/FileSlice'
import { useAppDispatch } from '../../../../hooks/useAppRedux'
import { getSizeFormat } from '../../../../helpers/getSize'


export const File: React.FC<IFile> = ({date, name, size, type, _id }) => {
   const dispatch = useAppDispatch()

   return (
      <div className={`file ${type !== 'dir' ? 'no-dir' : ''}`} onClick={() => {
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
            <img src={deleteImg} onClick={(e) => {
               e.stopPropagation()
               dispatch(deleteFile(_id))
            }} className="cart" alt="cart" />
         </div>
         <div className="file__item">
            {new Date(date).toLocaleDateString()}
         </div>
         <div className="file__item">
            {getSizeFormat(size)}
         </div>
      </div>
      )
}