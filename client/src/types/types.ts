export interface User {
   email: string
   password: string
   usedSpace?: number
   diskSpace?: number
   avatar?: string
}

export interface Response<T>{
  message: string
  user: T
  token: string
}

export interface AuthState {
   user: User | null
   token: string | null
   error: string
   isLoaded: boolean
}

export interface FileProgress extends Omit<IFile, 'size' | 'date' | 'type' | '_id'>{
   id: string
   progress: number

}

export interface FileState {
   files: IFile[]
   parentDirs: string[]
   uploadFiles: FileProgress[]
   currentDir: undefined | string
   error: string
   isLoaded: boolean
   params: QueryParams
}

export interface IFile {
   _id: string
   name: string
   type: string
   size: number
   date: Date
}

export interface Filter {
   id: number
   value: string
}

export interface Sort {
   id: 'asc' | 'desc'
   value: string
}


export interface QueryParams {
   page: number,
   pageSize: number
   filters: Filter[]
   sort: 'asc' | 'desc'
   searchValue: string
}