import { StyleSheet } from 'react-native';

import colors from '../../../constants/colors';
import fonts from '../../../constants/fonts';

export default StyleSheet.create({
  wrapper: {
    height: 60,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: colors.black,
    paddingLeft: 14,
    paddingRight: 14,
    paddingTop: 8,
    paddingBottom: 8,
    height: 60
  },
  sideIcon: {
    width: 34,
    height: 34,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },
  emptyText: {
    fontSize: fonts.fontSize.body,
    color: colors.white,
    fontWeight: '700'
  },
  trackInfoButton: {
    flex: 1,
    marginRight: 14
  },
  trackInfo: {
    // flex: 1,
    // marginRight: 14
  },
  trackInfoTitle: {
    fontSize: fonts.fontSize.body,
    color: colors.white,
    fontWeight: '700',
    marginBottom: 2
  },
  trackInfoArtist: {
    fontSize: fonts.fontSize.small,
    color: colors.paragraphGrayed,
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
