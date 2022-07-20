import React from 'react'
import loader from '@assets/imgs/loader.svg'

import './Loader.css'

export const Loader: React.FC = () => {

   return (
      <div className='loader'>
         <img src={loader} alt="loader"/>
      </div>
      )
}