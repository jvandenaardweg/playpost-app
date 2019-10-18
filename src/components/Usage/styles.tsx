import { StyleSheet } from 'react-native';

import colors from '../../constants/colors';
import layout from '../../constants/layout';
import spacing from '../../constants/spacing';
import { UserTheme } from '../../reducers/user';

export default (theme?: UserTheme) => StyleSheet.create({
  container: {
    paddingLeft: spacing.default,
    paddingRight: spacing.default
  },
  wrapper: {
    backgroundColor: theme === UserTheme.dark ? colors.gray900 : colors.white,
    padding: spacing.large,
    marginBottom: 0
  },
  statsContainer: {
    paddingBottom: spacing.small
  },
  statsWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end'
  },
  statsBigNumber: {
    color: theme === UserTheme.dark ? colors.white : colors.black,
    letterSpacing: -0.75
  },
  statsNumbersContainer: {
    flexDirection: 'row',
    flexGrow: 1,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 4
  },
  statsMeta: {
    color: theme === UserTheme.dark ? colors.gray200 : colors.gray900,
    marginLeft: 4,
    marginBottom: 2,
  },
  statsPercentage: {
    color: theme === UserTheme.dark ? colors.white : colors.black
  },
  upgradeContainer: {
    marginTop: spacing.default
  },
  progressContainer: {
    backgroundColor: theme === UserTheme.dark ? colors.gray700 : 'rgba(0, 0, 0, 0.1)',
    height: 6,
    borderRadius: layout.borderRadius.small,
    overflow: 'hidden',
    marginTop: 6
  },
  progress: {
    height: 6,
    borderRadius: layout.borderRadius.small
  },
  messageText: {
    marginTop: 8,
    color: theme === UserTheme.dark ? colors.gray200 : colors.gray900,
    textAlign: 'center'
  }
});
