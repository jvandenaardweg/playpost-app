import { StyleSheet } from 'react-native';

import colors from '../../constants/colors';
import spacing from '../../constants/spacing';
import { UserTheme } from '../../reducers/user';

export default (theme: UserTheme) => StyleSheet.create({
  seperator: {
    backgroundColor: theme === UserTheme.dark ? colors.gray900 : colors.articleBackground,
    paddingLeft: spacing.default,
    paddingRight: spacing.default
  },
  seperatorLine: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme === UserTheme.dark ? colors.gray700 : colors.grayLight,
  }
});
