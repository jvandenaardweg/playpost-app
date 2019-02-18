import {
  StyleSheet
} from 'react-native';

import Colors from '@/constants/Colors';

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: Colors.black,
    paddingLeft: 14,
    paddingRight: 14,
    paddingTop: 8,
    paddingBottom: 8,
    height: 50
  },
  sideIcon: {
    width: 34,
    height: 34,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },
  emptyText: {
    color: Colors.white
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
    fontSize: 12,
    color: Colors.white,
  },
  trackInfoArtist: {
    fontSize: 12,
    color: Colors.white,
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
    justifyContent: 'center'
  },
  controlPlay: {
    width: 28,
    height: 28,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
