import React, { ReactNode, useContext } from 'react'
import { View } from 'react-native'
import spacing from '../../constants/spacing'

import Text from '../Text';

import { UserThemeContext } from '../../contexts/UserThemeProvider';
import styles from './styles'

export interface Props {
  label?: string;
  children: ReactNode;
  RightElement?: ReactNode;
}

export const InputGroup: React.FC<Props> = React.memo((props) => {
  const { theme } = useContext(UserThemeContext);

  return (
    <View style={styles(theme).container}>
      {props.RightElement && (
        <View style={styles(theme).rightElementContainer} testID="InputGroup-View-right-element-container">
          {props.RightElement}
        </View>
      )}
      {props.label ? <Text preset="leadEmphasized" style={{ marginBottom: spacing.nano }} testID="InputGroup-Text-label">{props.label}</Text> : undefined}
      {props.children}
    </View>
  )
})
