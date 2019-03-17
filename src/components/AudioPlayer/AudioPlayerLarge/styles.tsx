import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  wrapper: {
    flex: 1,
    paddingTop: 42,
    backgroundColor: '#000'
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
    backgroundColor: '#161616',
    marginTop: 24,
    marginBottom: 24,
    borderTopColor: '#373737',
    borderTopWidth: 1,
    borderBottomColor: '#373737',
    borderBottomWidth: 1,
    overflow: 'hidden'
  },
  scrollableContent: {
    padding: 24,
  },
  contentText: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 25,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '700',
    marginBottom: 6
  },
  album: {
    color: 'gray'
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
    marginBottom: 34
  }
});
