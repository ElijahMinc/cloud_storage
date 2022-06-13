import React, { useRef } from 'react'
import { NavLink } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../hooks/useAppRedux'
import { useAuth } from '../../hooks/useAuth'
import { authSelector, refreshUser } from '../../redux/slices/AuthSlice'
import fakeAvatar from '../../assets/imgs/fake-avatar.png'

import './Header.css'
import { deleteAvatar, uploadAvatar } from '../../redux/slices/FileSlice'
interface IHeader {

}

export const Header: React.FC<IHeader> = () => {
   const avatarRef = useRef<HTMLInputElement | null>(null)
   const { user } = useAppSelector(authSelector)

   const {isAuth} = useAuth()
   const dispatch = useAppDispatch()
   const avatar = user?.avatar ? `http://localhost:1998/${user?.avatar}` : fakeAvatar 


   const handleUploadAvatarOrDeleted = (e: React.ChangeEvent<HTMLInputElement>) => {

         const file = e.target.files

         if(!file) return
   
         dispatch(uploadAvatar(file[0]))
      
   }

   const handleUploadAvatarOrDelet = (e: React.ChangeEvent<HTMLInputElement>) => {

      const file = e.target.files
   }

   return (
      <header className='header'>
         <div className='header__logo'>
            MERN CLOUD
         </div>
         <div className='header__btns'>
            {isAuth ? (
               <>
                 <div className="header__avatar">
                     <img src={avatar} alt="avatar" onClick={() => {
                        if(!!user?.avatar){
                           dispatch(deleteAvatar())
                  
                        }else{
                           avatarRef.current?.click()

                        }
                     }}/>
                     <input ref={avatarRef} type="file" className="avatar" onChange={handleUploadAvatarOrDeleted}/>
                 </div>
                 <div className="header__btn" onClick={() => dispatch(refreshUser())}>Log Out</div>
               </>

            ) : (
               <>
                  <div className="header__btn">
                     <NavLink to="/login">
                        Auth
                     </NavLink>
                  </div>
                  <div className="header__btn">
                     <NavLink to="/register">
                        Register
                     </NavLink>
                  </div>
               </>
            )}
         </div>
      </header>
      )
}