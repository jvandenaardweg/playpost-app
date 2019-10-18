import { StyleSheet } from 'react-native';

import colors from '../../constants/colors';
import spacing from '../../constants/spacing';
import { UserTheme } from '../../reducers/user';

export default (theme?: UserTheme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: (theme === UserTheme.dark) ? colors.gray800 : colors.white
  },
  footer: {
    padding: spacing.large,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: (theme === UserTheme.dark) ? 'transparent' : colors.borderDefault,
    backgroundColor: (theme === UserTheme.dark) ? colors.gray800 : colors.white
  }
});
