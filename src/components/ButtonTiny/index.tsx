import React, { useContext } from 'react';
import { TouchableHighlight, View } from 'react-native';

import colors from '../../constants/colors';
import { UserThemeContext } from '../../contexts/UserThemeProvider';
import Text from '../Text';
import styles from './styles';

interface Props {
  label: string;
  backgroundColor?: string;
  labelColor?: string;
  IconElement?: React.ComponentType<any> | React.ReactElement;
  onPress(): void;
}

export const ButtonTiny: React.FC<Props> = React.memo((props) => {
  const { theme } = useContext(UserThemeContext);

  return (
    <TouchableHighlight
      testID="ButtonTiny-Button"
      onPress={props.onPress}
      activeOpacity={0.7}
      underlayColor={colors.black}
      style={[styles(theme).container, { backgroundColor: props.backgroundColor }]}
    >
      <View style={[styles(theme).wrapper, { backgroundColor: props.backgroundColor }]}>
        <Text style={{ color: props.labelColor }} preset="footnoteEmphasized">{props.label}</Text>
        {props.IconElement && (
          <View style={styles(theme).icon}>
            {props.IconElement}
          </View>
        )}
      </View>
    </TouchableHighlight>
  );
});
