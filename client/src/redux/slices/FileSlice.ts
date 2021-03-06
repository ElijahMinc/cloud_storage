import { defaultQueryParams } from '@helpers/getQueryParams';
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import axios, { AxiosResponse, AxiosError, } from 'axios'
import { FileProgress, FileState, Filter, IFile, QueryParams } from "@typesModule/types"
import { RootState } from "@redux/store"
import { fetchUserThunk } from './AuthSlice';
import { setToast } from './ToastSlice';




const initialState: FileState = {
   files: [],
   parentDirs: [],
   uploadFiles: [],
   params: defaultQueryParams,
   currentDir: undefined,
   error: '',
   isLoaded: false
 }
 
export const fetchFiles = createAsyncThunk<IFile[], {currentDir: string | undefined, queryParams: QueryParams}>('fetchFiles', async (fileData, { dispatch, rejectWithValue }) => {
   const { currentDir, queryParams } = fileData

   let url = `${process.env.REACT_APP_API_URL}/file`

   if(queryParams.searchValue && currentDir) {
      url += `?search=${queryParams.searchValue}&id=${currentDir}`
   }else if(queryParams.searchValue && queryParams.sort && currentDir) {
      url += `?search=${queryParams.searchValue}&id=${currentDir}&sort=${queryParams.sort}`
   }else if(currentDir){
      url += `?id=${currentDir}`
   } else if(queryParams.searchValue) {
      url += `?search=${queryParams.searchValue}`
   }  
   // else if(!!queryParams.filters.length) {
   //    url += `?filter=${queryParams.filters[0].value}`
   // } 
    else if (!!queryParams.sort) {
      url += `?sort=${queryParams.sort}`
   } 

    try {
        const response: AxiosResponse<IFile[], any> = await axios.get(url, {
           headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
           }
        })

        return response.data

    } catch (err) {

      let error = err as AxiosError<{message: string}> 
     dispatch(setToast({title: error.response?.data?.message ?? 'Error with fetch files', status: 'error'}))

      return rejectWithValue(error.response?.data || 'Error with login')
    }
  }
)

export const createFolder = createAsyncThunk<IFile, {name: string, parentId?: string}>('file/create', async (folderData, { dispatch, rejectWithValue }) => {

   try {
       const response: AxiosResponse<IFile, any> = await axios.post(`${process.env.REACT_APP_API_URL}/file`, folderData, {
          headers: {
             'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
       })
       dispatch(setToast({title: 'The folder has been successfully created', status: 'success'}))
       return response.data

   } catch (err) {

     let error = err as AxiosError<{message: string}> 
     dispatch(setToast({title: error.response?.data?.message ?? 'Error with create folder', status: 'error'}))

     return rejectWithValue(error.response?.data || 'Error with login')
   }
 }
)

export const deleteFile = createAsyncThunk<IFile[], string>('file/delete', async (dirId, { dispatch, rejectWithValue }) => {

   try {
       const response: AxiosResponse<IFile[], any> = await axios.delete(`${process.env.REACT_APP_API_URL}/file/${dirId}`, {
          headers: {
             'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
       })
       dispatch(setToast({title: 'The folder has been successfully deleted', status: 'success'}))

       return response.data

   } catch (err) {

     let error = err as AxiosError<{message: string}> 
     dispatch(setToast({title: error.response?.data?.message ?? 'Error with deleted file', status: 'error'}))

     return rejectWithValue(error.response?.data || 'Error with login')
   }
})

export const uploadFile = createAsyncThunk<IFile, { file: File, parentId?: string}>('file/upload', async (fileData, { rejectWithValue, dispatch }) => {

   try {
      const formData = new FormData()

      formData.append('file', fileData.file)

      if(fileData.parentId){
         formData.append('parentId', fileData.parentId)
      }
      const id = "id" + Math.random().toString(16).slice(2)
      let uploadingFile = {
         id,
         name: fileData.file.name,
         progress: 0
      }
      dispatch(setUploadFile(uploadingFile))

       const response: AxiosResponse<IFile> = await axios.post(`${process.env.REACT_APP_API_URL}/file/upload`,formData, {
          headers: {
             'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          onUploadProgress: (progressEvent) => {
            const percent = Math.floor((progressEvent.loaded * 100) / progressEvent.total);
               const copyUploadingFile = {...uploadingFile, progress: percent}
               dispatch(setProgressUploadFile(copyUploadingFile))

          }
       })
       dispatch(setToast({title: 'The file has been successfully uploaded', status: 'success'}))

       return response.data

   } catch (err) {

     let error = err as AxiosError<{ message: string }> 
     dispatch(setToast({title: error.response?.data?.message ?? 'Error with upload file', status: 'error'}))

     return rejectWithValue(error.response?.data || 'Error with login')
   }
})

export const downloadFile = createAsyncThunk<void,  Pick<IFile, 'name' | 'type' | '_id'>>('file/download', async (file, { dispatch, rejectWithValue }) => {

   try {
       const response: AxiosResponse<Blob> = await axios.get(`${process.env.REACT_APP_API_URL}/file/download/${file._id}`, {
          responseType: 'blob',
          headers: {
             'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
       })
       const downloadURL = URL.createObjectURL(response.data)
       const link = document.createElement('a')
       link.href = downloadURL
       link.setAttribute('download', `${file.name}.${file.type}`)
       link.click()
       URL.revokeObjectURL(downloadURL)

       link.remove()
       dispatch(setToast({title: 'The file has been successfully downloaded', status: 'success'}))

   } catch (err) {

     let error = err as AxiosError<{message: string}> 
     dispatch(setToast({title: error.response?.data?.message ?? 'Error with upload file', status: 'error'}))

     return rejectWithValue(error.response?.data || 'Error with login')
   }
})

export const uploadAvatar = createAsyncThunk<void,  File>('file/avatar/upload', async (file, { dispatch, rejectWithValue }) => {

   try {
      const data = new FormData();
      data.append('file', file)

       await axios.post(`${process.env.REACT_APP_API_URL}/file/avatar/upload`,data, {
          headers: {
             'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
       })
       await dispatch(fetchUserThunk(localStorage.getItem('token') ?? ''))
       dispatch(setToast({title: 'The avatar has been successfully uploaded', status: 'success'}))

   } catch (err) {

     let error = err as AxiosError<{message: string}> 
     dispatch(setToast({title: error.response?.data?.message ?? 'Error with upload Avatar', status: 'error'}))

     return rejectWithValue(error.response?.data || 'Error with login')
   }
})


export const deleteAvatar = createAsyncThunk<void>('file/avatar/delete', async (_, { dispatch, rejectWithValue }) => {

   try {


       await axios.delete(`${process.env.REACT_APP_API_URL}/file/avatar/delete`, {
          headers: {
             'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
       })

       await dispatch(fetchUserThunk(localStorage.getItem('token') ?? ''))
       dispatch(setToast({title: 'The avatar has been successfully deleted', status: 'error'}))

   } catch (err) {

     let error = err as AxiosError<{message: string}>
     dispatch(setToast({title: error.response?.data?.message ?? 'Error with deleted Avatar', status: 'error'}))

     return rejectWithValue(error.response?.data || 'Error with login')
   }
})

 export const fileSlice = createSlice({
   name: 'file',
   initialState,
   reducers: {
      setCurrentDir(state, action: PayloadAction<string>){
         state.currentDir = action.payload
      },
      setParentId(state, action: PayloadAction<string>){
         state.parentDirs.push(action.payload)
      },
      setUpdatedParentDirsOfId(state, action: PayloadAction<string[]>){
         state.parentDirs = action.payload
      },
      setProgressUploadFile(state, action: PayloadAction<FileProgress>){
         state.uploadFiles = state.uploadFiles.map((uploadFile) => {
            if(uploadFile.id === action.payload.id){
               return {
                  ...uploadFile,
                  progress: action.payload.progress
               }
            }else{
               return uploadFile
            }
         })
      },
      setUploadFile(state, action: PayloadAction<FileProgress>){
         state.uploadFiles.push(action.payload)
      },
      setRefreshFilesUpload(state){
         state.uploadFiles = []
      },

      setSearchValue(state, action: PayloadAction<string>){
         state.params.searchValue = action.payload
      },
      setFilterValue(state, action: PayloadAction<Filter>){
         state.params.filters = [action.payload]
      },
      setSortValue(state, action: PayloadAction<QueryParams['sort']>){
         state.params.sort = action.payload
      },
      setPageValue(state, action: PayloadAction<number>){
         state.params.page = action.payload
      },
   },
   extraReducers: (build) => {
      build.addCase(fetchFiles.fulfilled, (state, action) => {
         state.files = action.payload
         state.isLoaded = true
      })
      build.addCase(fetchFiles.pending, (state) => {
        state.isLoaded = false
      })
      build.addCase(fetchFiles.rejected, (state, action) => {
          state.error = action.error.message || ''
          state.isLoaded = true
      })

      build.addCase(createFolder.fulfilled, (state, action) => {
         state.files = [...state.files, action.payload]
         state.isLoaded = true
      })
      build.addCase(createFolder.pending, (state) => {
        state.isLoaded = false
      })
      build.addCase(createFolder.rejected, (state, action) => {
          state.error = action.error.message || ''
          state.isLoaded = true
      })


      build.addCase(deleteFile.fulfilled, (state, action) => {
         state.files = action.payload
         state.isLoaded = true
      })
      build.addCase(deleteFile.pending, (state) => {
        state.isLoaded = false
      })
      build.addCase(deleteFile.rejected, (state, action) => {
          state.error = action.error.message || ''
          state.isLoaded = true
      })

      
      build.addCase(uploadFile.fulfilled, (state, action) => {
         state.files = [...state.files, action.payload]
         state.isLoaded = true
      })
      build.addCase(uploadFile.pending, (state) => {
        state.isLoaded = false
      })
      build.addCase(uploadFile.rejected, (state, action) => {
          state.error = action.error.message || ''
          state.isLoaded = true
      })

   }
 })

export  const { setCurrentDir, setParentId, setUpdatedParentDirsOfId, setSearchValue, setProgressUploadFile, setRefreshFilesUpload, setUploadFile, setFilterValue, setPageValue,setSortValue } = fileSlice.actions

 
export const fileSelector = (state: RootState) => state.file

export default fileSlice.reducer