import { StyleSheet } from 'react-native';

import colors from '../../constants/colors';
import fonts from '../../constants/fonts';
import layout from '../../constants/layout';
import spacing from '../../constants/spacing';

export default StyleSheet.create({
  container: {
    paddingLeft: spacing.default,
    paddingRight: spacing.default,
    marginLeft: spacing.default,
    marginRight: spacing.default,
  },
  wrapper: {
    backgroundColor: colors.tintColor,
    padding: spacing.large,
    marginBottom: 0,
    borderRadius: layout.borderRadius.medium
  },
  headerTitle: {
    color: colors.white,
    fontSize: fonts.fontSize.title,
    fontWeight: fonts.fontWeight.bold
  },
  statsContainer: {
    paddingBottom: spacing.small
  },
  statsTitle: {
    color: colors.white,
    fontSize: fonts.fontSize.body,
    fontWeight: fonts.fontWeight.normal,
    opacity: 0.7
  },
  statsWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end'
  },
  statsBigNumber: {
    color: colors.white,
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
    color: colors.white,
    opacity: 0.7,
    marginLeft: 4,
    marginBottom: 2
  },
  statsPercentage: {
    color: colors.white
  },
  upgradeContainer: {
    marginTop: spacing.default
  },
  progressContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    height: 6,
    borderRadius: layout.borderRadius.small,
    overflow: 'hidden',
    marginTop: 6
  },
  progress: {
    backgroundColor: colors.white,
    height: 6,
    borderRadius: layout.borderRadius.small
  },
  messageText: {
    marginTop: 8,
    color: colors.white,
    opacity: 0.7,
    textAlign: 'center'
  }
});
