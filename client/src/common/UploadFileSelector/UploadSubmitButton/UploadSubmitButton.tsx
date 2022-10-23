import { useTranslate } from "@/hooks/useTranslations"
import { Button } from "@chakra-ui/react"
import React from "react"
import { useUploadFileSelector } from "../Context/UploadFileContext"

interface UploadButtonProps {}

export const UploadSubmitButton: React.FC<UploadButtonProps> = () => {
  const { onSubmit } = useUploadFileSelector()
  const { t } = useTranslate()
  return (
    <Button onClick={onSubmit} colorScheme="blue" variant="solid">
      {t("save")}
    </Button>
  )
}
