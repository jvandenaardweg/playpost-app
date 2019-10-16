import { StyleSheet } from 'react-native';

import colors from '../../constants/colors';
import spacing from '../../constants/spacing';
import { UserTheme } from '../../reducers/user';

export default (theme?: UserTheme) => StyleSheet.create({
  seperator: {
    backgroundColor: theme === UserTheme.dark ? 'rgba(255, 255, 255, 0.1)' : colors.articleBackground,
    paddingLeft: spacing.default,
    paddingRight: spacing.default
  },
  seperatorLine: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme === UserTheme.dark ? 'rgba(255, 255, 255, 0.1)' : colors.grayLight,
  }
});
