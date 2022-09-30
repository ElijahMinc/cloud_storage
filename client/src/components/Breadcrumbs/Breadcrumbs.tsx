import React, { useEffect, useMemo } from "react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@chakra-ui/react"
import { BreadcrumbsItem } from "./BreadcrumbsItem"
import { useSelector } from "react-redux"
import { parentDirsSelector, setParentId } from "@/redux/slices/FileSlice"
import { ParentDir } from "@/types/types"
import "./Breadcrumb.css"

const defaultOptionsBreadcrumbs: ParentDir[] = [
  {
    id: "first-bread-crumb",
    name: "Home",
  },
]

export const Breadcrumbs: React.FC = () => {
  const parentDirs = useSelector(parentDirsSelector)

  const parentDirsBreadCrumps = useMemo(
    () => [...defaultOptionsBreadcrumbs, ...parentDirs],
    [parentDirs]
  )

  const indexOfLastElement = useMemo(() => {
    const lastElement = parentDirsBreadCrumps.at(-1)
    return lastElement ? parentDirsBreadCrumps.indexOf(lastElement) : 0
  }, [parentDirsBreadCrumps])

  return (
    <Breadcrumb separator="/" className="breadcrumbs">
      {parentDirsBreadCrumps.map(({ id, name }, idx) => (
        <React.Fragment key={id}>
          <BreadcrumbsItem
            path={id}
            content={name}
            isHomeBreadCrumb={name === "Home"}
            isLastElement={idx === indexOfLastElement}
          />
        </React.Fragment>
        //   <BreadcrumbSeparator/>
      ))}
    </Breadcrumb>
  )
}
