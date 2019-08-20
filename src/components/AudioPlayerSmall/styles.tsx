import { StyleSheet } from 'react-native';

import colors from '../../constants/colors';
import fonts from '../../constants/fonts';
import spacing from '../../constants/spacing';

export default StyleSheet.create({
  wrapper: {
    height: 55
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: colors.black,
    paddingLeft: spacing.default,
    paddingRight: spacing.default,
    paddingTop: 8,
    paddingBottom: 8,
    height: 55,
  },
  leftIcon: {
    width: 20,
    height: 34,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.medium
  },
  rightIcon: {
    width: 20,
    height: 34,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.default,
    marginRight: spacing.nano
  },
  emptyText: {
    fontSize: fonts.fontSize.body,
    color: colors.white,
    fontWeight: fonts.fontWeight.medium
  },
  trackInfoButton: {
    flex: 1,
    // marginRight: spacing.default
  },
  trackInfo: {
    // flex: 1,
    // marginRight: spacing.default
  },
  trackInfoTitle: {
    fontSize: fonts.fontSize.small,
    color: colors.white,
    fontWeight: fonts.fontWeight.bold,
    marginBottom: 2
  },
  trackInfoArtist: {
    fontSize: fonts.fontSize.tiny,
    color: colors.grayDark,
  },
  controls: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  playButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: -6
  },
  controlPlay: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  progressBarContainer: {
    height: '100%',
    width: '100%',
    position: 'absolute'
  }
});
