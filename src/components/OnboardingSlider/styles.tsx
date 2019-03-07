import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#037DE2'
  },
  mainContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#037DE2',
    padding: 14,
    paddingTop: 0,
    paddingBottom: '27%'
  },
  image: {
    width: 320,
    height: 320,
  },
  text: {
    color: 'rgba(255, 255, 255, 0.8)',
    backgroundColor: 'transparent',
    textAlign: 'center',
    paddingHorizontal: 16,
    fontSize: 16,
    lineHeight: 24,
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
    color: 'white',
    backgroundColor: 'transparent',
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: '500',
    fontFamily: 'Merriweather-Regular'
  }
});
