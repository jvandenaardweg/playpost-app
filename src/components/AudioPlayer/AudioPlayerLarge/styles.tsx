import { StyleSheet } from 'react-native';

import fonts from '../../../constants/fonts';
import colors from '../../../constants/colors';

export default StyleSheet.create({
  wrapper: {
    flex: 1,
    paddingTop: 42,
    backgroundColor: colors.black
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  openCloseControl: {
    alignItems: 'flex-end',
    marginBottom: 16,
    paddingRight: 24,
    paddingLeft: 24
  },
  controlsContainer: {
    paddingLeft: 24,
    paddingRight: 24
  },
  titleContainer: {
    paddingLeft: 24,
    paddingRight: 24
  },
  scrollableContainer: {
    flexGrow: 1,
    flexShrink: 1,
    backgroundColor: colors.grayDarkest,
    marginTop: 24,
    marginBottom: 24,
    borderTopColor: colors.grayDarker,
    borderTopWidth: 1,
    borderBottomColor: colors.grayDarker,
    borderBottomWidth: 1,
    overflow: 'hidden'
  },
  scrollableContent: {
    padding: 24,
  },
  contentText: {
    color: colors.white,
    fontSize: fonts.fontSize.body,
    lineHeight: 25,
  },
  title: {
    color: colors.white,
    fontSize: fonts.fontSize.title,
    lineHeight: 22,
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
    marginBottom: 14,
    backgroundColor: 'red'
  }
});
