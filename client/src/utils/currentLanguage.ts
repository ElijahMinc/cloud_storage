import { LANGUAGES, LocalStorageKeys } from '../constant'

export const setCurrentLanguage = (language: LANGUAGES) => {
  localStorage.setItem(LocalStorageKeys.LANGUAGE, language)
}

export const getCurrentLanguage = (): LANGUAGES => {
  return (localStorage.getItem(LocalStorageKeys.LANGUAGE) as LANGUAGES) || LANGUAGES.EN
}
