import { useTranslate } from "@/hooks/useTranslations"
import {
  Box,
  Checkbox,
  Flex,
  FormLabel,
  Input,
  Select,
  Text,
} from "@chakra-ui/react"
import React, { useMemo, useState } from "react"
import { useUploadFileSelector } from "../Context/UploadFileContext"

export const UploadFileSettings: React.FC = () => {
  const { t } = useTranslate()
  const {
    handleChangeFormat,
    handleChangeCompress,
    handleChangeDownload,
    setImageDesimisions,
    desmisionsImage,
    imageInfo: { type },
    isDownload,
    isCompress,
  } = useUploadFileSelector()

  const formats = useMemo(
    () => [
      {
        id: 3,

        value: "webp",
      },
      {
        id: 1,
        value: "png",
      },
      {
        id: 2,

        value: "jpeg",
      },
      {
        id: 5,

        value: "jpg",
      },
      {
        id: 4,

        value: "pdf",
      },
    ],
    []
  )

  const defaultFormat = useMemo(() => {
    return formats.find((format) => format.value === type) ?? formats[0].value
  }, [])

  console.log("desmisionsImage", defaultFormat)
  return (
    <div className="preview__settings">
      <Text as="h2" fontWeight="bold" fontSize={22} marginBottom={5}>
        {t("transformation-settings")}:
      </Text>
      <Flex>
        <Box
          w="150px"
          marginRight={5}
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
        >
          <FormLabel>{t("format-image")}:</FormLabel>
          <Select onChange={handleChangeFormat}>
            {formats.map(({ id, value }) => (
              <option key={id} value={value}>
                {value}
              </option>
            ))}
          </Select>
        </Box>

        <Box
          w="150px"
          marginRight={5}
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
        >
          <FormLabel>{t("width-image")}:</FormLabel>
          <Input
            type="number"
            value={desmisionsImage.width}
            onChange={(e) =>
              setImageDesimisions(
                (prev: { width: number; height: number }) => ({
                  ...prev,
                  width: e.target.value,
                })
              )
            }
          />
        </Box>
        <Box
          w="150px"
          marginRight={5}
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
        >
          <FormLabel>{t("height-image")}:</FormLabel>

          <Input
            type="number"
            value={desmisionsImage.height}
            onChange={(e) =>
              setImageDesimisions(
                (prev: { width: number; height: number }) => ({
                  ...prev,
                  height: e.target.value,
                })
              )
            }
          />
        </Box>
        <Box
          w="150px"
          display="flex"
          flexDirection="column"
          justifyContent="space-around"
        >
          <Checkbox isChecked={isCompress} onChange={handleChangeCompress}>
            : {t("compress")}
          </Checkbox>
          <Checkbox
            isChecked={isDownload}
            checked
            onChange={handleChangeDownload}
          >
            : {t("download")}
          </Checkbox>
          {/* <Checkbox onChange={handleChangeZipped}>Upload</Checkbox> */}
        </Box>
      </Flex>
    </div>
  )
}
