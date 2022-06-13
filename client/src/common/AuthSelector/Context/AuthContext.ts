import React, { createContext, ReactElement, useContext, useState } from 'react'
import { ProviderData } from '../types/types'


export const AuthContext = createContext<any | null>(null)

export const useAuthSelector = () => useContext(AuthContext)