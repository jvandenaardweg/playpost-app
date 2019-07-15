import { StyleSheet } from 'react-native';
import colors from '../../constants/colors';
import fonts from '../../constants/fonts';
import spacing from '../../constants/spacing';

export default StyleSheet.create({
  container: {
    marginRight: spacing.default,
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
    marginLeft: 6,
    marginRight: -1
  }
});
