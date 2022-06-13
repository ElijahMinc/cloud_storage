import React from 'react'
import './Loader.css'
import loader from '../../assets/imgs/loader.svg'

export const Loader: React.FC = () => {

   return (
      <div className='loader'>
         <img src={loader} alt="loader"/>
      </div>
      )
}