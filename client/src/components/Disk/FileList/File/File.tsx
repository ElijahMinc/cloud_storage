import React, { forwardRef } from "react"
import dirImg from "@assets/imgs/folder.png"
import fileImg from "@assets/imgs/file.png"
import {
  deleteFile,
  downloadFile,
  setCurrentDir,
  setParentId,
} from "@redux/slices/FileSlice"
import { useAppDispatch } from "@hooks/useAppRedux"
import { getSizeFormat } from "@helpers/getSize"
import { motion } from "framer-motion"
import { DeleteIcon } from "@chakra-ui/icons"

import "./File.css"
import { Image, useBoolean } from "@chakra-ui/react"
import { downloadImage } from "@/utils/downloadImage"
import { useTranslate } from "@/hooks/useTranslations"

//IFile
export const File: React.FC<any> = forwardRef<any, any>(
  ({ date, name, size, type, _id, preview }, ref) => {
    const { t } = useTranslate()
    const [flag, setFlag] = useBoolean()
    const dispatch = useAppDispatch()
    const FileImage = !!preview ? (
      <div className="preview">
        <Image
          onMouseEnter={setFlag.on}
          onMouseLeave={setFlag.off}
          className="preview__part-image"
          src={preview}
        />
        {flag && <Image className="preview__full-image" src={preview} />}
      </div>
    ) : (
      <img src={preview ?? fileImg} alt="file" />
    )

    return (
      <div
        ref={ref}
        className={`file ${type !== "dir" ? "no-dir" : ""}`}
        onClick={() => {
          if (type !== "dir") return
          dispatch(setParentId({ id: _id, name }))
          dispatch(setCurrentDir(_id))
        }}
      >
        <div className="file__item">
          {type === "dir" ? <img src={dirImg} alt="folder" /> : FileImage}
        </div>
        <div className="file__item">
          <span>{name}</span>
        </div>
        <div
          className={`file__item download ${type === "dir" ? "touch" : ""}`}
          onClick={() => downloadImage(preview, { name, format: "png" })}
        >
          {type !== "dir" && t("download")}
        </div>
        <div className="file__item">
          <DeleteIcon
            onClick={(e) => {
              e.stopPropagation()
              dispatch(deleteFile(_id))
            }}
            className="cart"
          />
        </div>
        <div className="file__item">{new Date(date).toLocaleDateString()}</div>
        <div className="file__item">{getSizeFormat(size)}</div>
      </div>
    )
  }
)

export const MFile = motion(File)
