import { StyleSheet } from 'react-native';

import colors from '../../constants/colors';

import textInputStyle from '../../constants/text-input';
import spacing from '../../constants/spacing';

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.default,
    backgroundColor: colors.appBackground
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
    marginBottom: spacing.default
  },
  buttonTitleStyle: {
    color: colors.white,
  }
});
