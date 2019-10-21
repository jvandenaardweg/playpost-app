import {
  StyleSheet
} from 'react-native';
import colors from '../../constants/colors';
import { UserTheme } from '../../reducers/user';

export default (theme: UserTheme) => StyleSheet.create({
  container: {
    borderRadius: 32,
    height: 32,
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme === UserTheme.dark ? colors.gray400 : colors.gray
  },
  containerActive: {
    backgroundColor: colors.tintColor
  },
  isAvailable: {
    backgroundColor: theme === UserTheme.dark ? colors.gray400 : colors.black
  },
  icon: {
    color: colors.white,
    position: 'relative',
    right: -1
  }
});
