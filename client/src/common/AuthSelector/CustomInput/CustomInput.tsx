import React, { forwardRef } from "react"
import { useAuthSelector } from "../Context/AuthContext"
import { FormControl, FormLabel, Input } from "@chakra-ui/react"
import { motion } from "framer-motion"
import { useTranslate } from "@/hooks/useTranslations"

interface IInput {
  isEmail: boolean
}

export const CustomInput: React.FC<any> = forwardRef<any, IInput>(
  ({ isEmail = true }, ref) => {
    const {
      emailValue,
      passwordValue,
      handleChangeEmail,
      handleChangePassword,
    } = useAuthSelector()
    const { t } = useTranslate()
    return (
      <FormControl ref={ref}>
        <FormLabel>{t(isEmail ? "your-email" : "your-password")}</FormLabel>
        {isEmail ? (
          <Input
            type="email"
            value={emailValue}
            onChange={(e) => handleChangeEmail(e.target.value)}
            placeholder={t("enter-email")}
          />
        ) : (
          <Input
            type="password"
            value={passwordValue}
            onChange={(e) => handleChangePassword(e.target.value)}
            placeholder={t("enter-password")}
          />
        )}
      </FormControl>
    )
  }
)

export const MCustomInput = motion(CustomInput)
