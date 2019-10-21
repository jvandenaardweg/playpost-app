import React, { useContext } from 'react';
import { Button as RNEButton, ButtonProps } from 'react-native-elements';
import colors from '../../constants/colors';
import layout from '../../constants/layout';
import { UserThemeContext } from '../../contexts/UserThemeProvider';
import { UserTheme } from '../../reducers/user';
import { textPresets } from '../Text';

type Props = ButtonProps

export const Button: React.FC<Props> = React.memo(({...rest}) => {
  const { theme } = useContext(UserThemeContext);

  const disabledStyle = { backgroundColor: (theme === UserTheme.dark) ? colors.gray700 : colors.grayLightest }
  const titleStyle = { ...textPresets['bodyEmphasized'] }
  const buttonStyle = { height: 50, borderRadius: layout.borderRadius.small }
  const containerStyle = { borderRadius: layout.borderRadius.small }
  const loadingProps = { color: (theme === UserTheme.dark) ? 'white' : 'black' }

  return (
    <RNEButton
      loadingProps={loadingProps}
      containerStyle={containerStyle}
      buttonStyle={buttonStyle}
      titleStyle={titleStyle}
      disabledStyle={disabledStyle}
      {...rest}
    />
  )
})
