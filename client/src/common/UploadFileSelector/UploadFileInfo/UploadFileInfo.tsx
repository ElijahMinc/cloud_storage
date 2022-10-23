import { getSizeFormat } from "@/helpers/getSize"
import { useTranslate } from "@/hooks/useTranslations"
import { Text } from "@chakra-ui/react"
import React from "react"
import { useUploadFileSelector } from "../Context/UploadFileContext"

export const UploadFileInfo: React.FC = () => {
  const { t } = useTranslate()
  const {
    imageInfo: { name, size, type },
    desmisionsImage: { width, height },
  } = useUploadFileSelector()

  return (
    <div className="preview__upload-file-info">
      <Text>
        {t("name")}: {name}
      </Text>
      <Text>
        {t("size")}: {getSizeFormat(size ?? 0)}
      </Text>
      <Text>
        {t("format")}: {type}
      </Text>
      <Text>
        {t("width")}: {width}px
      </Text>
      <Text>
        {t("height")}: {height}px
      </Text>
    </div>
  )
}
