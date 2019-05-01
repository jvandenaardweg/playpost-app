import { StyleSheet } from 'react-native';
import colors from '../../../constants/colors';
import fonts from '../../../constants/fonts';

export default StyleSheet.create({
  container: {
    marginRight: 12,
    height: 40,
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row'
  },
  label: {
    color: colors.tintColor,
    fontWeight: fonts.fontWeight.medium,
    fontSize: fonts.fontSize.body
  },
  icon: {
    marginLeft: 6
  }
});
