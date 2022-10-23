import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react"
import React, { useRef, useState } from "react"
import { defaultFilters } from "@helpers/getFilters"
import { setFirstWordToUppercase } from "@helpers/setFirstWordToUppercase"
import { useAppDispatch, useAppSelector } from "@hooks/useAppRedux"
import {
  createFolder,
  fileSelector,
  setCurrentDir,
  setFilterValue,
  setRefreshFilesUpload,
  setSearchValue,
  setSortValue,
  setUpdatedParentDirsOfId,
  transformFile,
  uploadFile,
} from "@redux/slices/FileSlice"
import { Filter, QueryParams } from "@typesModule/types"
import { UploadDrawer } from "@/components/UploadDrawer/UploadDrawer"
import { Select } from "@chakra-ui/react"
import { SearchIcon } from "@chakra-ui/icons"
import { CustomModal } from "../../common/Modal/Modal"
import { useSelector } from "react-redux"
import { drawerSelector, setClose, setOpen } from "@/redux/slices/DrawerSlice"

import "./Navbar.css"
import { useTranslate } from "@/hooks/useTranslations"
import { useHistory } from "react-router-dom"
import {
  UploadFile,
  UploadFileData,
} from "../../common/UploadFileSelector/UploadFile"
import { Loader } from "../Loader/Loader"

export const Navbar: React.FC = () => {
  console.log("rerender")
  const { t } = useTranslate()
  const { onOpen, onClose, isOpen } = useDisclosure()
  const {
    onOpen: onOpenCustomize,
    onClose: onCloseCustomize,
    isOpen: isOpenCustomize,
  } = useDisclosure()
  const { isOpen: isOpenDrawer } = useSelector(drawerSelector)
  const inputUploadFileRef = useRef<HTMLInputElement>(null)

  const [modalValue, setModalValue] = useState("")
  const { push } = useHistory()
  const dispatch = useAppDispatch()
  const [filter, setFilter] = useState<Filter>(defaultFilters[0])
  const [sort, setSort] = useState<QueryParams["sort"]>("asc")

  const { currentDir, parentDirs, isLoadedConvertPicture } =
    useAppSelector(fileSelector)

  const handleBack = () => {
    const newParentDirs = [...parentDirs]
    const indexOfLastElement = newParentDirs.findIndex(
      (dir) => dir.id === currentDir
    )
    newParentDirs.splice(indexOfLastElement, 1)

    const prevParentDir = newParentDirs[indexOfLastElement - 1]

    dispatch(setCurrentDir(prevParentDir?.id ?? ""))
    dispatch(setUpdatedParentDirsOfId(newParentDirs))
  }

  const handleUploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && inputUploadFileRef.current) {
      dispatch(setOpen())
      dispatch(setRefreshFilesUpload())

      const files = Array.from(e.target.files)

      files.forEach((file) => {
        const fileData: { file: File; parentId?: string } = { file }

        if (currentDir) {
          fileData.parentId = currentDir
        }

        dispatch(uploadFile(fileData))
      })

      inputUploadFileRef.current.value = ""
    }
  }

  const handleSubmitModal = () => {
    const createFolderData: {
      name: string
      parentId?: string
    } = {
      name: modalValue,
    }
    if (currentDir) {
      createFolderData.parentId = currentDir
    }
    dispatch(createFolder(createFolderData))
    setModalValue("")
    onClose()
  }
  const handleSubmitConverter = async (data: UploadFileData) => {
    await dispatch(transformFile(data))
  }

  const handleSubmitConverterModal = () => {
    console.log("submit")
  }

  const handleSearchValue = () => {
    let timeout: NodeJS.Timeout

    return (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!!timeout) {
        clearTimeout(timeout)
      }

      timeout = setTimeout(() => {
        dispatch(setSearchValue(e.target.value))
      }, 500)
    }
  }

  return (
    <nav className="navbar">
      <div className="navbar__item">
        {!!parentDirs.length && (
          <Button colorScheme="blue" size="xs" onClick={handleBack}>
            {t("back")}
          </Button>
        )}

        <Button colorScheme="blue" width="200px" onClick={onOpen}>
          {t("create-new-folder")}
        </Button>
        <Button colorScheme="blue" position="relative" width="200px">
          <FormLabel
            display="flex"
            justifyContent="center"
            alignItems="center"
            m={0}
            top="0"
            left="0"
            right="0"
            bottom="0"
            colorScheme="blue"
            htmlFor="file"
            cursor="pointer"
            position="absolute"
          >
            {t("upload-file")}
            <input
              ref={inputUploadFileRef}
              id="file"
              multiple
              onChange={handleUploadFile}
              type="file"
            />
          </FormLabel>
        </Button>
        <Button colorScheme="blue" width="200px" onClick={onOpenCustomize}>
          {t("converter")}
        </Button>
      </div>
      <div className="navbar__item">
        <InputGroup>
          <InputLeftElement
            pointerEvents="none"
            children={<SearchIcon color="gray.300" />}
          />
          <Input
            type="text"
            variant="flushed"
            onChange={handleSearchValue()}
            placeholder={t("search-file")}
          />
        </InputGroup>
      </div>
      <div className="navbar__item" style={{ flexDirection: "column" }}>
        <Text fontSize={"2xl"} color="primary.500" mb={2}>
          {t("sort-by")}:
        </Text>
        <Stack spacing={2}>
          <Select
            value={filter.id}
            onChange={(e) => {
              const choosedOption = defaultFilters.find(
                (filter) => filter.id === +e.target.value
              )
              if (choosedOption) {
                setFilter(choosedOption)
                dispatch(setFilterValue(choosedOption))
              }
            }}
          >
            {defaultFilters.map(({ id, value }) => (
              <option key={id} value={id}>
                {t(`by-${value}`)}
              </option>
            ))}
          </Select>
          <Select
            value={sort}
            onChange={(e) => {
              const sortValue = e.target.value as QueryParams["sort"]
              setSort(sortValue)
              dispatch(setSortValue(sortValue))
            }}
          >
            <option value="asc">{t("asc")}</option>
            <option value="desc">{t("desc")}</option>
          </Select>
        </Stack>
      </div>
      <CustomModal
        title={t("create-new-folder")}
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={handleSubmitModal}
      >
        <FormControl mt={4}>
          <FormLabel>{t("folder-name")}</FormLabel>
          <Input
            type="text"
            value={modalValue}
            onChange={(e) => setModalValue(e.target.value)}
            placeholder={t("enter-folder-name")}
          />
        </FormControl>
      </CustomModal>
      <CustomModal
        title={t("convert-image")}
        isOpen={isOpenCustomize}
        size="4xl"
        withFooter={false}
        modalBodyProps={{
          // minHeight: 400,
          flexBasis: 400,
        }}
        onClose={() => {
          // push("/")
          onCloseCustomize()
        }}
        onSubmit={handleSubmitConverterModal}
      >
        <UploadFile
          onSubmit={handleSubmitConverter}
          isLoaded={isLoadedConvertPicture}
        >
          <UploadFile.Settings />
          <UploadFile.SubmitButton />
        </UploadFile>
      </CustomModal>
      <UploadDrawer
        isOpen={isOpenDrawer}
        onClose={() => dispatch(setClose())}
      />
    </nav>
  )
}
