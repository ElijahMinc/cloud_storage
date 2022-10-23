import { Flex, Text } from "@chakra-ui/react"
import React, { DragEvent, MouseEvent, useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "@hooks/useAppRedux"
import { fetchFiles, fileSelector, uploadFile } from "@redux/slices/FileSlice"
import { Loader } from "@components/Loader/Loader"
import { FileList } from "./FileList/FileList"
import { useTranslate } from "@/hooks/useTranslations"
import { setOpen } from "@/redux/slices/DrawerSlice"
import "./Disk.css"

export const Disk: React.FC = () => {
  const dispatch = useAppDispatch()
  const {
    currentDir,
    files,
    isLoaded,
    params: queryParams,
  } = useAppSelector(fileSelector)
  const { t } = useTranslate()
  // const [filter, setFilter] = useState<Filter[]>(defaultFilters)
  // const [params, setParams] = useState<QueryParams>(defaultQueryParams)

  const [dragEnter, setDragEnter] = useState(false)

  const isNotEmptyFilesOrDrag = files.length && !dragEnter

  useEffect(() => {
    dispatch(fetchFiles({ currentDir, queryParams }))

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDir, queryParams])

  const dragEnterHandler = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragEnter(true)
  }

  const dragOverHandler = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragEnter(true)
  }

  const dragLeaveHandler = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragEnter(false)
  }

  const dropHandler = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    dispatch(setOpen())
    let files = Array.from(e.dataTransfer.files)
    files.forEach((file) =>
      dispatch(uploadFile({ file, parentId: currentDir }))
    )
    setDragEnter(false)
  }

  return (
    <div
      className="disk"
      onDragOver={dragOverHandler}
      onDragEnter={dragEnterHandler}
      onDrop={dropHandler}
      onDragLeave={dragLeaveHandler}
    >
      {isLoaded ? (
        isNotEmptyFilesOrDrag ? (
          <>
            <div className="disk-info">
              <div className="disk-info__item">
                <Text fontSize="md">{t("by-name")}</Text>
              </div>
              <div className="disk-info__item">
                <Text fontSize="md">{t("by-date")}</Text>
              </div>
              <div className="disk-info__item">
                <Text fontSize="md">{t("size")}</Text>
              </div>
            </div>
            <div className="files">
              <FileList />
            </div>
          </>
        ) : (
          <Flex justifyContent="center" alignItems="center" height="300px">
            <Text as="h2">{t("drag-and-drop")}</Text>
          </Flex>
        )
      ) : (
        <Loader isFixed />
      )}
    </div>
  )
}
