import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import styles from './styles';

interface Props {
  label: string;
  backgroundColor?: string;
  labelColor?: string;
  IconElement?: React.ComponentType<any> | React.ReactElement;
  onPress(): void;
  style?: object;
}

export const ButtonTiny: React.FC<Props> = React.memo(({ onPress, label, IconElement, backgroundColor, labelColor, style }) => {
  return (
    <TouchableOpacity testID="ButtonTiny-Button" onPress={onPress} style={[styles.container, { backgroundColor }, style]}>
      <>
        <Text style={[styles.label, { color: labelColor }]}>{label}</Text>
        {IconElement && (
          <View style={styles.icon}>
            {IconElement}
          </View>
        )}
      </>
    </TouchableOpacity>
  );
});
