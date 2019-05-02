import { StyleSheet } from 'react-native';

import fonts from '../../../constants/fonts';
import colors from '../../../constants/colors';
import spacing from '../../../constants/spacing';

export default StyleSheet.create({
  wrapper: {
    flex: 1,
    paddingTop: 30,
    backgroundColor: colors.black
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  openCloseControl: {
    alignItems: 'flex-end',
    marginBottom: 10,
    paddingRight: spacing.large,
    paddingLeft: spacing.large
  },
  controlsContainer: {
    paddingLeft: spacing.large,
    paddingRight: spacing.large
  },
  titleContainer: {
    paddingTop: spacing.large,
    paddingLeft: spacing.large,
    paddingRight: spacing.large
  },
  scrollableContainer: {
    flexGrow: 1,
    flexShrink: 1,
    backgroundColor: '#1f1f1f',
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
    borderTopWidth: 1,
    borderTopColor: '#333333',
    marginTop: 0,
    marginBottom: spacing.large,
    overflow: 'hidden'
  },
  scrollableContent: {
    padding: spacing.large,
  },
  contentText: {
    color: colors.white,
    fontSize: fonts.fontSize.body,
    lineHeight: 24,
    marginBottom: spacing.large
  },
  title: {
    color: colors.white,
    fontSize: fonts.fontSize.titleLarge,
    lineHeight: 26,
    fontWeight: fonts.fontWeight.semibold,
    marginBottom: 6
  },
  album: {
    color: colors.paragraphGrayed,
    fontSize: fonts.fontSize.small
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 42
  },
  progressBarRow: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'center',
    marginBottom: spacing.default,
    backgroundColor: 'red'
  }
});
