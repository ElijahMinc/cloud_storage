import React, { useEffect, useState } from 'react'
import { Modal } from '../../common/Modal/Modal'
import { defaultFilters } from '../../helpers/getFilters'
import { defaultQueryParams } from '../../helpers/getQueryParams'
import { useAppDispatch, useAppSelector } from '../../hooks/useAppRedux'
import { fetchFiles, fileSelector } from '../../redux/slices/FileSlice'
import { FileState, Filter, QueryParams,  } from '../../types/types'
import { Loader } from '../Loader/Loader'
import { Navbar } from '../Navbar/Navbar'

import './Disk.css'
import { FileList } from './FileList/FileList'
interface IDisk {

}

export const Disk: React.FC<IDisk> = () => {
   const dispatch = useAppDispatch();
   const {  currentDir, isLoaded, params: queryParams } = useAppSelector(fileSelector)
   // const [filter, setFilter] = useState<Filter[]>(defaultFilters)
   // const [params, setParams] = useState<QueryParams>(defaultQueryParams)


   useEffect(() => {
      dispatch(fetchFiles({currentDir, queryParams}))
   }, [currentDir, queryParams])

   return (
      <div className='disk'>
         <div className="disk-info">
            <div className='disk-info__item'>
               Name
            </div>
            <div className='disk-info__item'>
               Data
            </div>
            <div className='disk-info__item'>
               Size
            </div>
         </div>
         <div className="files">
            {isLoaded ? (
                <FileList />

            ) : (
               <Loader />
            )}
         </div>
      
      </div>
      )
}