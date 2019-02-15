import {
  StyleSheet
} from 'react-native';

import Colors from '../../constants/Colors'

export default StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.appBackground,
    paddingRight: 24,
    paddingLeft: 24
  },
  centered: {
    textAlign: 'center'
  },
  title: {
    textAlign: 'center',
    fontFamily: 'Merriweather-Regular',
    fontSize: 22,
    fontWeight: '400',
    color: Colors.titleDefault,
    marginBottom: 20
  },
  description: {
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 24,
    color: Colors.paragraphGrayed,
    paddingRight: 36,
    paddingLeft: 36
  }
});
