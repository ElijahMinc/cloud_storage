import React from 'react'
import { Disk } from '@components/Disk/Disk'
import { Navbar } from '@components/Navbar/Navbar'

interface IHomePage {}

export const HomePage: React.FC<IHomePage> = () => {

   return (
      <div className='homepage'>
         <Navbar />
         <Disk/>
      </div>
      )
}