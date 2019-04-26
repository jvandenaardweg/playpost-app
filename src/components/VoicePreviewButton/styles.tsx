import {
  StyleSheet
} from 'react-native';
import colors from '../../constants/colors';

export default StyleSheet.create({
  container: {
    borderRadius: 30,
    height: 30,
    width: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.black
  },
  icon: {
    position: 'relative',
    right: -1,
    color: colors.white
  }
});
