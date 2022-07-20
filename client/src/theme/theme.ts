import { extendTheme, type ThemeConfig } from '@chakra-ui/react'

// Chakra UI default values
//https://github.com/chakra-ui/chakra-ui/tree/main/packages/theme/src/foundations 
const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
}

const theme = extendTheme({ 
  config, 
  colors: {
    primary: {
      500: '#566885'
    }
  }
})

export default theme