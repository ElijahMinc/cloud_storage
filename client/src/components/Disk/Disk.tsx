import { Flex, Text } from "@chakra-ui/react"
import React, { DragEvent, MouseEvent, useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "@hooks/useAppRedux"
import { fetchFiles, fileSelector, uploadFile } from "@redux/slices/FileSlice"
import { Loader } from "@components/Loader/Loader"
import { FileList } from "./FileList/FileList"

import "./Disk.css"
import { useSelector } from "react-redux"
import { drawerSelector, setOpen } from "@/redux/slices/DrawerSlice"

export const Disk: React.FC = () => {
  const dispatch = useAppDispatch()
  const {
    currentDir,
    files,
    isLoaded,
    params: queryParams,
  } = useAppSelector(fileSelector)
  // const [filter, setFilter] = useState<Filter[]>(defaultFilters)
  // const [params, setParams] = useState<QueryParams>(defaultQueryParams)
  const { isOpen: isOpenDrawer } = useSelector(drawerSelector)

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
    files.forEach((file) => dispatch(uploadFile({ file, parentId: currentDir })))
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
      {isNotEmptyFilesOrDrag ? (
        <>
          <div className="disk-info">
            <div className="disk-info__item">
              <Text fontSize="md">Name</Text>
            </div>
            <div className="disk-info__item">
              <Text fontSize="md">Data</Text>
            </div>
            <div className="disk-info__item">
              <Text fontSize="md">Size</Text>
            </div>
          </div>
          <div className="files">{isLoaded ? <FileList /> : <Loader />}</div>
        </>
      ) : (
        <Flex justifyContent="center" alignItems="center" height="300px">
          <Text as="h2">Upload the Drag and Drop file here or create a folder</Text>
        </Flex>
      )}
    </div>
  )
}
