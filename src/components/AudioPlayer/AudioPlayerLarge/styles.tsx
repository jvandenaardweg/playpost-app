import { StyleSheet } from 'react-native';

import fonts from '../../../constants/fonts';
import colors from '../../../constants/colors';

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
    paddingRight: 24,
    paddingLeft: 24
  },
  controlsContainer: {
    paddingLeft: 24,
    paddingRight: 24,
  },
  titleContainer: {
    paddingTop: 24,
    paddingLeft: 24,
    paddingRight: 24
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
    marginBottom: 24,
    overflow: 'hidden'
  },
  scrollableContent: {
    padding: 24,
  },
  contentText: {
    color: colors.white,
    fontSize: fonts.fontSize.body,
    lineHeight: 24,
    marginBottom: 22
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
    marginBottom: 14,
    backgroundColor: 'red'
  }
});
