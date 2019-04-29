import {
  StyleSheet
} from 'react-native';
import colors from '../../constants/colors';

export default StyleSheet.create({
  container: {
    borderRadius: 32,
    height: 32,
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.black
  },
  containerActive: {
    backgroundColor: colors.tintColor
  },
  icon: {
    color: colors.white,
    position: 'relative',
    right: -1
  }
});
