import { StyleSheet } from 'react-native';

import colors from '../../constants/colors';
import fonts from '../../constants/fonts';
import spacing from '../../constants/spacing';

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
    shadowOpacity: 0.5,
    shadowRadius: 3.84,

    elevation: 10,
  },
  articleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 70,
    borderRadius: 6,
    textAlign: 'center'
  },
  footer: {
    marginTop: 12
  },
  footerRow: {
    flexDirection: 'row'
  },
  errorMessage: {
    textAlign: 'center',
    fontSize: fonts.fontSize.body,
    color: colors.red,
    fontWeight: fonts.fontWeight.semibold
  },
  successMessage: {
    textAlign: 'center',
    fontSize: fonts.fontSize.body,
    color: colors.green,
    fontWeight: fonts.fontWeight.semibold
  }
});
