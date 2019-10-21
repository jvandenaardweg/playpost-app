import React from 'react';

import * as Icon from '../Icon';

import { View } from 'react-native';
import colors from '../../constants/colors';
import { ButtonTiny } from '../ButtonTiny';
import styles from './styles';

// import styles from './styles';

interface Props {
  onPress(): void;
}

export const ButtonUpgrade: React.FC<Props> = React.memo((props) => {
  return (
    <View style={styles.container}>
      <ButtonTiny
        label="Upgrade"
        labelColor={colors.white}
        onPress={props.onPress}
        backgroundColor={colors.tintColor}
        IconElement={<Icon.FontAwesome5 name="star" solid size={12} color={colors.white} />}
      />
    </View>
  );
});
