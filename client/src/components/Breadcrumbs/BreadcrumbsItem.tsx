import { useAppSelector } from "@/hooks/useAppRedux"
import {
  fileSelector,
  setCurrentDir,
  setParentId,
  setUpdatedParentDirsOfId,
} from "@/redux/slices/FileSlice"
import { BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react"
import React from "react"
import { useDispatch } from "react-redux"

export interface IBreadcrumb {
  path: string
  content: string
  isHomeBreadCrumb?: boolean
  isLastElement?: boolean
}

export const BreadcrumbsItem: React.FC<IBreadcrumb> = ({
  content,
  path,
  isLastElement,
  isHomeBreadCrumb = false,
}) => {
  const { currentDir, parentDirs } = useAppSelector(fileSelector)
  const dispatch = useDispatch()

  const handleOnClick = () => {
    if (isHomeBreadCrumb) {
      dispatch(setUpdatedParentDirsOfId([]))
      dispatch(setCurrentDir(""))

      return
    }
    if (currentDir) {
      const indexDir = parentDirs.findIndex((dir) => dir.id === currentDir)
      console.log("indexDir", indexDir)
      const prevDirId = parentDirs[indexDir]
      console.log("prevDirId", prevDirId)

      const newParentDirs = [...parentDirs]

      newParentDirs.splice(newParentDirs.length - 1, 1)

      dispatch(setCurrentDir(path))
      dispatch(setUpdatedParentDirsOfId(newParentDirs))
    }
  }

  return (
    <BreadcrumbItem isCurrentPage={isLastElement}>
      <BreadcrumbLink onClick={handleOnClick}>{content}</BreadcrumbLink>
      <span className="separator">{!isLastElement && '/' }</span>
    </BreadcrumbItem>
  )
}
