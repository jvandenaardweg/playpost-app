import { StyleSheet } from 'react-native';
import colors from '../../constants/colors';
import fonts from '../../constants/fonts';
import spacing from '../../constants/spacing';

export default StyleSheet.create({
  container: {
    height: 28,
    borderRadius: 28,
    paddingLeft: spacing.small,
    paddingRight: spacing.small,
    backgroundColor: colors.grayLight,
    alignItems: 'center',
    flexDirection: 'row'
  },
  // icon: {
  //   marginTop: 2,
  //   marginRight: 4
  // },
  icon: {
    marginLeft: 6,
    marginRight: -1
  },
  label: {
    fontWeight: fonts.fontWeight.semibold,
    fontSize: fonts.fontSize.small
  }
});
