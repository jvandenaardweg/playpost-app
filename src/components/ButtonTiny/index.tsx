import React from 'react';
import { TouchableHighlight, View } from 'react-native';

import colors from '../../constants/colors';
import { Text } from '../Text';
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
        <Text style={{ color: labelColor }} template="footnoteEmphasized">{label}</Text>
        {IconElement && (
          <View style={styles.icon}>
            {IconElement}
          </View>
        )}
      </View>
    </TouchableHighlight>
  );
});
