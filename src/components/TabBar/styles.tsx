import { StyleSheet } from 'react-native';

import colors from '../../constants/colors';
import { UserTheme } from '../../reducers/user';

export default (theme?: UserTheme) => StyleSheet.create({
  container: {
    borderTopColor: theme === UserTheme.dark ? '#1E1E1E' : colors.borderDefault,
    backgroundColor: theme === UserTheme.dark ? '#1E1E1E' : colors.tabBar
  },
  bottomTabBar: {
    backgroundColor: theme === UserTheme.dark ? '#1E1E1E' : colors.tabBarBackgroundColor,
    borderTopColor: theme === UserTheme.dark ? '#1E1E1E' : colors.tabBarBorderColor
  }
});
