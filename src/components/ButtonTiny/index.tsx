import React from 'react';
import { Text, TouchableHighlight, View } from 'react-native';

import colors from '../../constants/colors';
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
    <TouchableHighlight
      testID="ButtonTiny-Button"
      onPress={onPress}
      activeOpacity={0.7}
      underlayColor={colors.black}
      style={[styles.container, { backgroundColor }]}
    >
      <View style={[styles.wrapper, { backgroundColor }]}>
        <Text style={[styles.label, { color: labelColor }]}>{label}</Text>
        {IconElement && (
          <View style={styles.icon}>
            {IconElement}
          </View>
        )}
      </View>
    </TouchableHighlight>
  );
});
