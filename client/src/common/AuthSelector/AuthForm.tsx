import React, { useCallback, useMemo, useState } from "react"
import { AuthContext } from "./Context/AuthContext"
import { CustomInput, MCustomInput } from "./CustomInput/CustomInput"
import { CustomButton, MCustomButton } from "./CustomButton/CustomButton"
import { Box } from "@chakra-ui/react"
import { motion } from "framer-motion"
import { useTranslate } from "@/hooks/useTranslations"
interface ThemedForm {
  children: React.ReactNode
  title?: string
  onSubmit: (data: any) => void
}

export const AuthForm = ({ children, title, onSubmit }: ThemedForm) => {
  const { t } = useTranslate()
  const [emailValue, setEmailData] = useState("")
  const [passwordValue, setPasswordValue] = useState("")

  const handleChangeEmail = useCallback(
    (value: string) => {
      setEmailData(value)
    },
    [emailValue]
  )

  const handleChangePassword = useCallback(
    (value: string) => {
      setPasswordValue(value)
    },
    [passwordValue]
  )

  const onSubmitHandle = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = {
      emailValue,
      passwordValue,
    }

    onSubmit(data)
  }

  const value = useMemo(
    () => ({
      emailValue,
      passwordValue,
      handleChangeEmail,
      handleChangePassword,
    }),
    [emailValue, passwordValue]
  )

  return (
    <motion.form
      className="form"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      onSubmit={onSubmitHandle}
    >
      <Box p={1} shadow={"base"}>
        <div className="auth">
          {title && (
            <motion.h2
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {t(title)}
            </motion.h2>
          )}
          <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
        </div>
      </Box>
    </motion.form>
  )
}

AuthForm.Input = CustomInput
AuthForm.MInput = MCustomInput
AuthForm.Button = CustomButton
AuthForm.MButton = MCustomButton
