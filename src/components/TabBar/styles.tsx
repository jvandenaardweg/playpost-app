import { StyleSheet } from 'react-native';

import colors from '../../constants/colors';
import { UserTheme } from '../../reducers/user';

export default (theme: UserTheme) => StyleSheet.create({
  container: {
    backgroundColor: theme === UserTheme.dark ? colors.gray800 : colors.tabBarBackgroundColor,
    borderTopColor: theme === UserTheme.dark ? colors.gray500 : colors.tabBarBorderColor
  },
  bottomTabBar: {
    backgroundColor: theme === UserTheme.dark ? colors.gray800 : colors.tabBarBackgroundColor,
    borderTopColor: theme === UserTheme.dark ? colors.gray500 : colors.tabBarBorderColor
  }
});
