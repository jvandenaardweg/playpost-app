import React from 'react'
import { ThemeProvider } from 'react-native-elements';

import { reactNativeElementsTheme } from '../../theme';

export const ReactNativeThemeProvider: React.FC = React.memo((props) => {
  return (
    <ThemeProvider theme={reactNativeElementsTheme}>
      {props.children}
    </ThemeProvider>
  )
})
