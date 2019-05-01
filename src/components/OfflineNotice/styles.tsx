import { StyleSheet } from 'react-native';
import colors from '../../constants/colors';

export default StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: colors.redDark,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    color: colors.white
  }
});
