import React from 'react';
import { Text, TouchableHighlight, View } from 'react-native';

import styles from './styles';

interface Props {
  label: string;
  backgroundColor?: string;
  labelColor?: string;
  IconElement?: React.ComponentType<any> | React.ReactElement;
  onPress(): void;
}

export const ButtonTiny: React.FC<Props> = React.memo(({ onPress, label, IconElement, backgroundColor, labelColor }) => {
  return (
    <TouchableHighlight testID="ButtonTiny-Button" onPress={onPress} style={[styles.container, { backgroundColor }]}>
      <>
        <Text style={[styles.label, { color: labelColor }]}>{label}</Text>
        {IconElement && (
          <View style={styles.icon}>
            {IconElement}
          </View>
        )}
      </>
    </TouchableHighlight>
  );
});
