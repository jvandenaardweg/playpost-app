import React, { useContext } from 'react';
import { View } from 'react-native';

import colors from '../../constants/colors';
import { ButtonTiny } from '../ButtonTiny';

import { UserThemeContext } from '../../contexts/UserThemeProvider';
import { UserTheme } from '../../reducers/user';
import styles from './styles';

interface Props {
  onPress(): void;
}

export const ButtonVoices: React.FC<Props> = React.memo(({ onPress }) => {
  const { theme } = useContext(UserThemeContext);

  const backgroundColor = (theme === UserTheme.dark) ? colors.gray600 : colors.grayLight;
  const labelColor = (theme === UserTheme.dark) ? colors.white : colors.black;

  return (
    <View style={styles(theme).container}>
      <ButtonTiny label="Voices" labelColor={labelColor} backgroundColor={backgroundColor} onPress={onPress} />
    </View>
  );
});
