import { StyleSheet } from 'react-native';

import colors from '../../constants/colors';
import { UserTheme } from '../../reducers/user';

export default (theme?: UserTheme) => StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme === UserTheme.dark ? colors.black : colors.grayLightest
  }
});
