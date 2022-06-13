export const setFirstWordToUppercase = (str: string): string => {
   const firstWord = str.split('')[0].toUpperCase()
   const strWithoutFirstWord = str.slice(1)
   return firstWord + strWithoutFirstWord
}