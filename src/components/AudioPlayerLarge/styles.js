import {
  StyleSheet
} from 'react-native';

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#3B8062',
    paddingLeft: 14,
    paddingRight: 14,
    paddingTop: 8,
    paddingBottom: 8
  },
  sideIcon: {
    width: 34,
    height: 34,
    flexShrink: 0,
    // backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 40,
    borderWidth: 1,
    borderColor: '#fff'
  },
  trackInfo: {
    flex: 1,
    marginLeft: 14,
    marginRight: 14
  },
  trackInfoTitle: {
    fontSize: 12,
    color: '#fff',
    textAlign: 'center'
  },
  trackInfoArtist: {
    fontSize: 11,
    color: '#fff',
    opacity: 0.8,
    textAlign: 'center'
  },
  // progress: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-between'
  // },
  controls: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  controlPlay: {
    // marginLeft: 32,
    // marginRight: 32
  },
  progressContainer: {
    // flexDirection: 'row'
  },
  progressBar: {
    height: 5,
    marginTop: 7,
    borderRadius: 10,
    overflow: 'hidden',
    flexDirection: 'row'
  },
  progressMeta: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  progressTotal: {
    backgroundColor: '#000000',
    opacity: 0.25
  },
  progressCurrent: {
    backgroundColor: 'white'
  },
  position: {
    fontSize: 12,
    color: '#fff'
  },
  duration: {
    fontSize: 12,
    color: '#fff'
  }
});
