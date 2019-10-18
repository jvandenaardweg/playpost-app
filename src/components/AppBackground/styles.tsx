import { StyleSheet } from 'react-native';

import colors from '../../constants/colors';
import { UserTheme } from '../../reducers/user';

export default (theme?: UserTheme) => StyleSheet.create({
  container: {
    backgroundColor: theme === UserTheme.dark ? colors.gray950 : colors.grayLightest,
    flex: 1,
    padding: 0
  }
});
