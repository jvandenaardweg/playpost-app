import React, { ReactNode } from 'react'
import { View } from 'react-native'
import spacing from '../../constants/spacing'

import { Text } from '../Text';

import styles from './styles'

export interface Props {
  label?: string;
  children: ReactNode;
  RightElement?: ReactNode;
}

export const InputGroup: React.FC<Props> = React.memo(({ label, children, RightElement }) => {
  return (
    <View style={styles.container}>
      {RightElement && (
        <View style={styles.rightElementContainer}>
          {RightElement}
        </View>
      )}
      {label ? <Text preset="leadEmphasized" style={{ marginBottom: spacing.nano }}>{label}</Text> : undefined}
      {children}
    </View>
  )
})
