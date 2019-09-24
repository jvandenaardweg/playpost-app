import { StyleSheet } from 'react-native';

import colors from '../../constants/colors';
import layout from '../../constants/layout';
import spacing from '../../constants/spacing';

export default StyleSheet.create({
  container: {
    paddingLeft: spacing.default,
    paddingRight: spacing.default
  },
  wrapper: {
    padding: spacing.large,
    paddingTop: spacing.default,
    paddingBottom: spacing.default,
    marginBottom: 0,
    borderRadius: layout.borderRadius.medium
  },
  statsContainer: {
    paddingBottom: spacing.small
  },
  statsWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end'
  },
  statsBigNumber: {
    color: colors.black,
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
    color: colors.grayDarkest,
    marginLeft: 4,
    marginBottom: 2,
  },
  statsPercentage: {
    color: colors.black
  },
  upgradeContainer: {
    marginTop: spacing.default
  },
  progressContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
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
    color: colors.grayDarkest,
    textAlign: 'center'
  }
});
