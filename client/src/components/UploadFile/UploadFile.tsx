import { getSizeFormat } from "@/helpers/getSize"
import { readBlob } from "@/helpers/readBlob"
import { Box, Input, Text } from "@chakra-ui/react"
import React, { useRef, useState } from "react"
import "./UploadFile.css"
interface UploadFileProps {}

export const UploadFile: React.FC<UploadFileProps> = () => {
  const inputUploadFileRef = useRef<HTMLInputElement>(null)
  const [imageBase64Url, setImageBase64Url] = useState("")
  const [imageInfo, setImageInfo] = useState<
    Partial<Pick<File, "name" | "size" | "type">>
  >({})

  const isSelectedFile = Object.keys(imageInfo).length

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

      console.log("file", base64Url)
      setImageBase64Url(base64Url as string)
      inputUploadFileRef.current.value = ""
    }
  }

  return (
    <Box
      bg="green.500"
      width="100%"
      height="100%"
      cursor="pointer"
      borderRadius={12}
      onClick={() => inputUploadFileRef.current?.click()}
      className={imageBase64Url ? "image-shadow" : ""}
    >
      <Text
        height="100%"
        fontWeight="bold"
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
          "Upload file"
        ) : (
          <>
            <div className="preview__upload-file-info">
              <Text>Name: {imageInfo.name}</Text>
              <Text>Size: {getSizeFormat(imageInfo.size ?? 0)}</Text>
              <Text>Format: {imageInfo.type}</Text>
            </div>
            {imageBase64Url && (
              <div className="preview__upload-file">
                <img src={imageBase64Url} alt="preview" />
              </div>
            )}
          </>
        )}
      </Text>
      <Input
        ref={inputUploadFileRef}
        onChange={handleUploadFile}
        type="file"
        display="none"
      />
    </Box>
  )
}
