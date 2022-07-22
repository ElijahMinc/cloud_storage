import React, { useRef } from 'react'
import { NavLink } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@hooks/useAppRedux'
import { useAuth } from '@hooks/useAuth'
import { authSelector, refreshUser } from '@redux/slices/AuthSlice'
import fakeAvatar from '@assets/imgs/fake-avatar.png'
import {motion} from 'framer-motion'
import { deleteAvatar, uploadAvatar } from '@redux/slices/FileSlice'
import { Avatar, Box, Link } from '@chakra-ui/react'
import './Header.css'
interface IHeader {}

const MCustom = {
   initial: {
      y: -200,
      opacity: 0
   },
   animate: (delay: number) => ({
      y: 0,
      opacity: 1,
      transition: {
         delay
      }
   })
}


export const Header: React.FC<IHeader> = () => {
   const avatarRef = useRef<HTMLInputElement | null>(null)
   const { user } = useAppSelector(authSelector)

   const {isAuth} = useAuth()
   const dispatch = useAppDispatch()
   const avatar = user?.avatar ? `${process.env.REACT_APP_API_URL}/${user?.avatar}` : fakeAvatar 


   const handleUploadAvatarOrDeleted = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files

      if(!file) return

      !!user?.avatar ?  dispatch(deleteAvatar()) : dispatch(uploadAvatar(file[0]))
   }

   return (
      <Box as='header' p={4} bg="primary.900" display='flex' alignItems="center" justifyContent="space-between">
         <motion.div custom={isAuth? 0.2: 0} variants={MCustom} animate="animate" initial="initial" className='header__logo'>
            MERN CLOUD
         </motion.div>
         <div className='header__btns'>
            {isAuth ? (
               <>
                  <Avatar cursor="pointer" width={35} height={35} src={avatar} onClick={() => avatarRef.current?.click()}/>
                     <input ref={avatarRef} type="file" className="avatar" onChange={handleUploadAvatarOrDeleted}/>
                 <div className="header__btn" onClick={() => dispatch(refreshUser())}>Log Out</div>
               </>

            ) : (
               <>
                  <motion.div custom={0.3} variants={MCustom} animate="animate" initial="initial" className="header__btn">
                     <Link colorScheme="blue">
                        <NavLink  to="/login">
                           Auth
                        </NavLink>
                     </Link>
                    
                  </motion.div>
                  <motion.div custom={0.4} variants={MCustom} animate="animate" initial="initial" className="header__btn">
                     <Link colorScheme="blue">
                        <NavLink to="/register">
                           Register
                        </NavLink>
                     </Link>
                  </motion.div>
               </>
            )}
         </div>
      </Box>
      )
}