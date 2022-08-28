import  { createContext, useContext } from 'react'


export const AuthContext = createContext<any | null>(null)

export const useAuthSelector = () => useContext(AuthContext)