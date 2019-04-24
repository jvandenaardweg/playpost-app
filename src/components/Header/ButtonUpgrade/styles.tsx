import { StyleSheet } from 'react-native';
import colors from '../../../constants/colors';

export default StyleSheet.create({
  container: {
    marginRight: 12,
    // width: 40,
    height: 40,
    alignItems: 'center',
    // justifyContent: 'center',
    flex: 1,
    flexDirection: 'row'
  },
  label: {
    color: colors.tintColor,
    fontWeight: '500'
  },
  icon: {
    marginLeft: 6
  }
});
