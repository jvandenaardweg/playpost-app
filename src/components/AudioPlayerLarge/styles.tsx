import { StyleSheet } from 'react-native';

import colors from '../../constants/colors';
import fonts from '../../constants/fonts';
import spacing from '../../constants/spacing';

export default StyleSheet.create({
  wrapper: {
    flex: 1,
    paddingTop: 46,
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
    lineHeight: Math.ceil(fonts.fontSize.body * 1.5),
    marginBottom: spacing.large
  },
  title: {
    color: colors.white,
    fontSize: fonts.fontSize.titleLarge,
    lineHeight: Math.ceil(fonts.fontSize.titleLarge * 1.2),
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
