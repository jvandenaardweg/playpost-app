import { StyleSheet } from 'react-native';

import colors from '../../constants/colors';
import fonts from '../../constants/fonts';
import spacing from '../../constants/spacing';

export default StyleSheet.create({
  container: {
    padding: 0
  },
  wrapper: {
    backgroundColor: colors.tintColor,
    padding: spacing.default,
    paddingBottom: spacing.large,
    // paddingTop: spacing.large,
    borderRadius: 0
  },
  header: {
    marginBottom: spacing.default
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
    fontWeight: fonts.fontWeight.bold
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
  }
});
