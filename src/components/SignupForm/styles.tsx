import { StyleSheet } from 'react-native';

import colors from '../../constants/colors';
import spacing from '../../constants/spacing';
import textInputStyle from '../../constants/text-input';

export default StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.large
  },
  form: {
    width: '100%'
  },
  formContent: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'column'
  },
  textField: textInputStyle,
  errorContainer: {
    minHeight: 20,
    marginBottom: spacing.default
  },
  errorText: {
    color: 'red'
  },
  buttonStyle: {
    backgroundColor: colors.black,
    marginBottom: spacing.default,
    opacity: 1
  },
  buttonStyleDisabled: {
    backgroundColor: colors.gray100
  },
  footerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    textAlign: 'center',
    maxWidth: 300,
    marginTop: spacing.large,
  },
  footerText: {
    color: colors.gray900,
    textAlign: 'center'
  },
  footerTextHighlight: {
    color: colors.black,
    textDecorationLine: 'underline'
  }
});
