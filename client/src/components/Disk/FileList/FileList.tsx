import React from 'react'
import { useDispatch } from 'react-redux';
import { useAppDispatch, useAppSelector } from '../../../hooks/useAppRedux';
import { fileSelector, setCurrentDir } from '../../../redux/slices/FileSlice';
import {File} from './File/File'
interface IFileList {

}

export const FileList: React.FC<IFileList> = () => {

   const {  files } = useAppSelector(fileSelector)

   return (
      <div className='file-list'>
         {!!files.length && files.map(file => (
            <File  key={file._id} {...file} />
         ))}
      </div>
      )
}