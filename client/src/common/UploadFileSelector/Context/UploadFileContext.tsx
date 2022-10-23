import { createContext, useContext } from "react"

export const UploadFileContext = createContext<any | null>(null)

export const useUploadFileSelector = () => useContext(UploadFileContext)
