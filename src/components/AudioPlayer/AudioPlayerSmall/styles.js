import {
  StyleSheet
} from 'react-native';

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#000',
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
    justifyContent: 'center',
    // borderRadius: 40
  },
  emptyText: {
    color: '#fff'
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
    color: '#fff',
  },
  trackInfoArtist: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.7
  },
  controls: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  playButton: {
    // backgroundColor: 'red',
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
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
