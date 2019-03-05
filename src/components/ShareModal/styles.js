import { StyleSheet } from 'react-native';
import Colors from '@/constants/colors';

export default StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    height: 260,
    padding: 14,
    borderRadius: 10
  },
  wrapper: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'stretch',
    alignContent: 'stretch'
  },
  articleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 170,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.grayLightest
  },
  footer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  footerRow: {
    flexDirection: 'row'
  },
  footerSave: {
    width: '50%',
    paddingLeft: 8,
  },
  footerCancel: {
    width: '50%',
    paddingRight: 8
  }
});
