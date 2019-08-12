import { StyleSheet } from 'react-native';

import colors from '../../constants/colors';
import fonts from '../../constants/fonts';
import spacing from '../../constants/spacing';

export default StyleSheet.create({
  container: {
    paddingLeft: spacing.default,
    paddingRight: spacing.default,
    marginTop: spacing.default * -1,
  },
  wrapper: {
    backgroundColor: colors.tintColor,
    padding: spacing.default,
    paddingBottom: spacing.large,
    marginBottom: spacing.tiny,
    borderRadius: 0
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
    marginTop: spacing.small,
    flexDirection: 'row',
    alignItems: 'flex-end'
  },
  statsBigNumber: {
    color: colors.white,
    fontSize: 32,
    fontWeight: fonts.fontWeight.bold,
    letterSpacing: -0.75
  },
  statsNumbersContainer: {
    flexDirection: 'row',
    flexGrow: 1,
    justifyContent: 'space-between',
    marginBottom: 4
  },
  statsMeta: {
    color: colors.white,
    fontSize: fonts.fontSize.body,
    opacity: 0.7,
    marginLeft: 4
  },
  statsPercentage: {
    color: colors.white,
    fontSize: fonts.fontSize.body,
    fontWeight: fonts.fontWeight.bold
  },
  upgradeContainer: {
    paddingTop: spacing.default
  },
  progressContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    height: 6,
    borderRadius: 6,
    overflow: 'hidden',
    marginTop: 6
  },
  progress: {
    backgroundColor: colors.white,
    height: 6,
    borderRadius: 6
  },
  messageText: {
    marginTop: 8,
    color: colors.white,
    opacity: 0.7,
    textAlign: 'center',
    fontSize: fonts.fontSize.small
  }
});
