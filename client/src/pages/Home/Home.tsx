import React from 'react'
import { Disk } from '@components/Disk/Disk'
import { Navbar } from '@components/Navbar/Navbar'
import { Breadcrumbs } from '@/components/Breadcrumbs/Breadcrumbs'

interface IHomePage {}

export const HomePage: React.FC<IHomePage> = () => {

   return (
      <div className='homepage'>
         <Navbar />
         <Breadcrumbs/>
         <Disk/>
      </div>
      )
}