import React, { useRef } from "react"
import { NavLink } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "@hooks/useAppRedux"
import { useAuth } from "@hooks/useAuth"
import { authSelector, refreshUser } from "@redux/slices/AuthSlice"
import fakeAvatar from "@assets/imgs/fake-avatar.png"
import { motion } from "framer-motion"
import { deleteAvatar, uploadAvatar } from "@redux/slices/FileSlice"
import { Avatar, Box, Link } from "@chakra-ui/react"
import { useTranslate } from "@/hooks/useTranslations"

import "./Header.css"
import { RadioCardGroup } from "@/common/RadioCard/RadioCard"
import { setCurrentLanguage } from "@/utils/currentLanguage"
import { LANGUAGES } from "@/constant"

const MCustom = {
  initial: {
    y: -200,
    opacity: 0,
  },
  animate: (delay: number) => ({
    y: 0,
    opacity: 1,
    transition: {
      delay,
    },
  }),
}

export const Header: React.FC = () => {


  const { t, i18n } = useTranslate()
  const avatarRef = useRef<HTMLInputElement | null>(null)
  const { user } = useAppSelector(authSelector)

  const { isAuth } = useAuth()
  const dispatch = useAppDispatch()
  const avatar = user?.avatar
    ? `${process.env.REACT_APP_API_URL}/${user?.avatar}`
    : fakeAvatar

  const handleUploadAvatarOrDeleted = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files

    if (!file) return

    dispatch(uploadAvatar(file[0]))
  }

  const onChangeHandle = (value: LANGUAGES) => {
    // setLang(value)
    setCurrentLanguage(value)
    i18n.changeLanguage(value)
  }

  return (
    <Box
      as="header"
      p={4}
      bg="primary.900"
      display="flex"
      alignItems="center"
      justifyContent="space-between"
    >
      <motion.div
        custom={isAuth ? 0.2 : 0}
        variants={MCustom}
        animate="animate"
        initial="initial"
        className="header__logo"
      >
        MERN CLOUD
      </motion.div>
      <RadioCardGroup onChange={onChangeHandle} />
      <div className="header__btns">
        {isAuth ? (
          <>
            <Avatar
              cursor="pointer"
              width={35}
              height={35}
              src={avatar}
              onClick={() =>
                !user?.avatar
                  ? avatarRef.current?.click()
                  : dispatch(deleteAvatar())
              }
            />
            <input
              ref={avatarRef}
              type="file"
              className="avatar"
              onChange={handleUploadAvatarOrDeleted}
            />
            <div
              className="header__btn"
              onClick={() => dispatch(refreshUser())}
            >
              {t('log-out')}
            </div>
          </>
        ) : (
          <>
            <motion.div
              custom={0.3}
              variants={MCustom}
              animate="animate"
              initial="initial"
              className="header__btn"
            >
              <Link colorScheme="blue">
                <NavLink to="/login">Auth</NavLink>
              </Link>
            </motion.div>
            <motion.div
              custom={0.4}
              variants={MCustom}
              animate="animate"
              initial="initial"
              className="header__btn"
            >
              <Link colorScheme="blue">
                <NavLink to="/register">Register</NavLink>
              </Link>
            </motion.div>
          </>
        )}
      </div>
    </Box>
  )
}
