import { StyleSheet } from 'react-native';

import colors from '../../../constants/colors';

export default StyleSheet.create({
  wrapper: {
    height: 55,
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
    height: 55
  },
  sideIcon: {
    width: 34,
    height: 34,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },
  emptyText: {
    color: colors.white
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
    fontSize: 14,
    color: colors.white,
    fontWeight: '600'
  },
  trackInfoArtist: {
    fontSize: 12,
    color: colors.white,
    opacity: 0.7
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
