import { StyleSheet } from 'react-native';

import colors from '../../constants/colors';
import layout from '../../constants/layout';
import spacing from '../../constants/spacing';

export default StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    height: 168,
    padding: spacing.default,
    borderRadius: layout.borderRadius.large,
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
  wrapper: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  articleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 70,
    borderRadius: layout.borderRadius.small,
    textAlign: 'center'
  },
  footer: {

  },
  footerRow: {
    flexDirection: 'row'
  },
  errorMessage: {
    textAlign: 'center',
    color: colors.red
  },
  successMessage: {
    textAlign: 'center',
    color: colors.green
  }
});
