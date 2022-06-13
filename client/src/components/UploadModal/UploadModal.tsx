import React from 'react'
import { useAppSelector } from '../../hooks/useAppRedux'
import { fileSelector } from '../../redux/slices/FileSlice'
import './UploadModal.css'

interface IUploadModal {
   onClose: () => void
}

export const UploadModal: React.FC<IUploadModal> = ({ onClose }) => {
   const { uploadFiles } = useAppSelector(fileSelector)

   return (
      <div className='upload-modal'>
         <div className="upload-modal__container">
            <div className="upload-files">
               {uploadFiles.map(({id, name, progress}) => (
                  <div key={`progress-${id}`} className="upload-files__item">
                     <div className='upload-files__name'>{name}</div>
                     <div className='upload-files__progress' style={{width: `${progress}%`}}>{progress}%</div>
                  </div>
               ))}
               
            </div>
            <div className='upload-modal__close' onClick={onClose}>
               X
            </div>
         </div>
      </div>
      )
}