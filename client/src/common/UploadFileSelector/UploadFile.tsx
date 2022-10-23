import { getSizeFormat } from "@/helpers/getSize"
import { readBlob } from "@/helpers/readBlob"
import { Box, Input, Text } from "@chakra-ui/react"
import React, { useMemo, useRef, useState } from "react"
import { UploadFileContext } from "./Context/UploadFileContext"
import { UploadFileInfo } from "./UploadFileInfo/UploadFileInfo"
import { UploadFileSettings } from "./UploadFileSettings/UploadFileSetting"
import "./UploadFile.css"
import { getImageDimensions } from "@/helpers/getImageDesmisions"
import { UploadSubmitButton } from "./UploadSubmitButton/UploadSubmitButton"
import { Loader } from "@/components/Loader/Loader"
import { useTranslation } from "react-i18next"

export interface UploadFileData {
  file: File
  width: string | number
  height: string | number
  isCompress: boolean | number
  isDownload: boolean | number
  name: string | number
  size: string | number
  type: string | number
}

export interface UploadFileDataResponse {
  message: string
  imageInfo: Pick<UploadFileData, "size" | "width" | "height"> & {
    format: string
  }
  image: string
  isDownload: boolean
}

interface UploadFileProps {
  children: React.ReactNode
  onSubmit: (data: UploadFileData) => void
  onHandleUploadFileChange?: (file: File) => void
  isLoaded: boolean
}

type ImageInfo = Pick<File, "name" | "size" | "type">

export const UploadFile = ({
  children,
  onSubmit,
  onHandleUploadFileChange,
  isLoaded,
}: UploadFileProps) => {
  const { t } = useTranslation()
  const inputUploadFileRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File>({} as File)
  const [imageBase64Url, setImageBase64Url] = useState("")
  const [format, setFormat] = useState("")
  const [isCompress, setCompress] = useState(false)
  const [isDownload, setDownload] = useState(true)

  const [desmisionsImage, setImageDesimisions] = useState({
    width: 0,
    height: 0,
  })
  const [imageInfo, setImageInfo] = useState<ImageInfo>({
    name: "Unknown name",
    size: 0,
    type: format ?? "Unknown type",
  } as ImageInfo)

  //   const [isZipped, setZipped] = useState("")

  const isSelectedFile = !!imageInfo.size

  const handleUploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && inputUploadFileRef.current) {
      const file = e.target.files[0]
      const format = file.type.split("/")[1]
      setImageInfo({
        name: file.name,
        size: file.size,
        type: format,
      })
      const base64Url = await readBlob(file)
      const desmisions = await getImageDimensions(base64Url as string)
      setFile(file)
      setImageBase64Url(base64Url as string)

      setImageDesimisions({
        width: desmisions.width,
        height: desmisions.height,
      })
      onHandleUploadFileChange?.(file)
      inputUploadFileRef.current.value = ""
    }
  }

  const handleChangeFormat = (e: React.ChangeEvent<any>) => {
    setFormat(e.target.value)
    setImageInfo((prevImageInfo) => ({
      ...prevImageInfo,
      type: e.target.value,
    }))
  }

  const handleChangeCompress = () => setCompress(!isCompress)
  const handleChangeDownload = () => setDownload(!isDownload)

  const onSubmitHandle = () => {
    const data: UploadFileData = {
      ...imageInfo,
      ...desmisionsImage,
      isDownload: isDownload ? 1 : 0,
      isCompress: isCompress ? 1 : 0,
      file: file,
    }
    console.log("data", data)
    onSubmit?.(data)
  }

  const value = useMemo(
    () => ({
      imageInfo,
      desmisionsImage,
      isDownload,
      isCompress,
      handleChangeFormat,
      handleChangeCompress,
      handleChangeDownload,
      setImageDesimisions,
      onSubmit: onSubmitHandle,
    }),
    [imageInfo, desmisionsImage, isCompress, isDownload]
  )

  return (
    <UploadFileContext.Provider value={value}>
      <Box width="100%" height="100%" position="relative">
        <Text
          cursor="pointer"
          onClick={() => inputUploadFileRef.current?.click()}
          height="500px"
          borderRadius={12}
          fontWeight="bold"
          bg="green.500"
          display="flex"
          color="whiteAlpha.900"
          justifyContent="center"
          alignItems="center"
          as="h3"
          fontSize={22}
          textTransform="uppercase"
          position="relative"
        >
          {!isSelectedFile ? (
            t("upload-file")
          ) : (
            <>
              <UploadFileInfo />
              {imageBase64Url && (
                <div className="preview__upload-file">
                  <img src={imageBase64Url} alt="preview" />
                </div>
              )}
            </>
          )}
        </Text>
        {isSelectedFile && children}
        <Input
          ref={inputUploadFileRef}
          onChange={handleUploadFile}
          type="file"
          display="none"
        />
        {!isLoaded && <Loader isFixed={false} />}
      </Box>
    </UploadFileContext.Provider>
  )
}

// UploadFile.FileInfo = UploadFileInfo
UploadFile.Settings = UploadFileSettings
UploadFile.SubmitButton = UploadSubmitButton
