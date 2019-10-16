import React, { useContext } from 'react';
import { TouchableHighlight, View } from 'react-native';

import colors from '../../constants/colors';
import Text from '../Text';
import styles from './styles';
import { UserThemeContext } from '../../contexts/UserThemeProvider';

interface Props {
  label: string;
  backgroundColor?: string;
  labelColor?: string;
  IconElement?: React.ComponentType<any> | React.ReactElement;
  onPress(): void;
}

export const ButtonTiny: React.FC<Props> = React.memo(({ onPress, label, IconElement, backgroundColor, labelColor }) => {
  const { theme } = useContext(UserThemeContext);

  return (
    <TouchableHighlight
      testID="ButtonTiny-Button"
      onPress={onPress}
      activeOpacity={0.7}
      underlayColor={colors.black}
      style={[styles(theme).container, { backgroundColor }]}
    >
      <View style={[styles(theme).wrapper, { backgroundColor }]}>
        <Text style={{ color: labelColor }} preset="footnoteEmphasized">{label}</Text>
        {IconElement && (
          <View style={styles(theme).icon}>
            {IconElement}
          </View>
        )}
      </View>
    </TouchableHighlight>
  );
});
