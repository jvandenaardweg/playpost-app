import React from 'react';
import { View } from 'react-native';

import colors from '../../constants/colors';
import { ButtonTiny } from '../ButtonTiny';

import styles from './styles';

interface Props {
  onPress(): void;
}

export const ButtonVoices: React.FC<Props> = React.memo(({ onPress }) => {
  return (
    <View style={styles.container}>
      <ButtonTiny label="Voices" labelColor={colors.black} backgroundColor={colors.grayLight} onPress={onPress} />
    </View>
  );
});
