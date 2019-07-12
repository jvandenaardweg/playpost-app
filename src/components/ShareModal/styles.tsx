import { StyleSheet } from 'react-native';

import colors from '../../constants/colors';
import spacing from '../../constants/spacing';
import fonts from '../../constants/fonts';

export default StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    height: 168,
    padding: spacing.default,
    borderRadius: 10,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  articleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 70,
    borderRadius: 6,
    // borderWidth: 1,
    // borderColor: colors.grayLightest
  },
  footer: {
    marginTop: 12
  },
  footerRow: {
    flexDirection: 'row'
  },
  errorMessage: {
    color: 'red'
  },
  successMessage: {
    fontSize: fonts.fontSize.body,
    color: colors.green,
    fontWeight: fonts.fontWeight.semibold
  }
});
