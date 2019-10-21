import React, { useContext } from 'react'
import { ThemeProvider } from 'react-native-elements';

import { UserThemeContext } from '../../contexts/UserThemeProvider'
import { UserTheme } from '../../reducers/user';
import { reactNativeElementsTheme } from '../../theme';

export const ReactNativeThemeProvider: React.FC = React.memo((props) => {
  const { theme } = useContext(UserThemeContext);

  return (
    <ThemeProvider theme={reactNativeElementsTheme}>
      {props.children}
    </ThemeProvider>
  )

})
