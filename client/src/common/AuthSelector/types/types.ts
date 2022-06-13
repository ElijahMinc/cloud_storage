
export interface ProviderData{
   data: Auth | null
   onChange: (data: Auth) => void
}

export interface Auth {
   email: string
   password: string
}

export interface ThemedAuthProps {
   children: React.ReactNode
}
