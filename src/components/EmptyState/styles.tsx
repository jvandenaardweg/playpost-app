import memoize from 'fast-memoize';
import { StyleSheet } from 'react-native';

import colors from '../../constants/colors';
import layout from '../../constants/layout';
import spacing from '../../constants/spacing';
import { UserTheme } from '../../reducers/user';

export default memoize((theme: UserTheme) => StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme === UserTheme.dark ? colors.black : colors.grayLightest,
    paddingRight: spacing.small,
    paddingLeft: spacing.small,
  },
  content: {
    alignItems: 'center'
  },
  title: {
    textAlign: 'center',
    color: theme === UserTheme.dark ? colors.white : colors.titleDefault,
    marginBottom: 6
  },
  description: {
    textAlign: 'center',
    paddingRight: spacing.large,
    paddingLeft: spacing.large,
    marginBottom: spacing.medium,
    color: theme === UserTheme.dark ? colors.gray100 : colors.black,
  },
  button: {
    marginTop: spacing.large,
    paddingLeft: spacing.large,
    paddingRight: spacing.large
  },
  icon: {
    marginTop: spacing.small,
    marginBottom: spacing.default,
    borderWidth: 1,
    borderColor: colors.grayLight,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: layout.borderRadius.small,
    opacity: 0.8
  }
}));
