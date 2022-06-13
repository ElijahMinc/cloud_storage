import React, { useEffect } from 'react'
import { Disk } from '../../components/Disk/Disk'
import { Navbar } from '../../components/Navbar/Navbar'
import { useAppDispatch } from '../../hooks/useAppRedux'
import { fetchUserThunk } from '../../redux/slices/AuthSlice'

interface IHomePage {

}

export const HomePage: React.FC<IHomePage> = () => {
   const dispatch = useAppDispatch()

   useEffect(() => {
      dispatch(fetchUserThunk())
   }, [])

   return (
      <div className='homepage'>
         <Navbar />
         <Disk/>
      </div>
      )
}