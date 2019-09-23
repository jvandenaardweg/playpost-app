import { StyleSheet } from 'react-native';

import colors from '../../constants/colors';

import spacing from '../../constants/spacing';
import textInputStyle from '../../constants/text-input';

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.large,
    // backgroundColor: colors.appBackground
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
  buttonStyleSuccess: {
    backgroundColor: colors.green,
    marginBottom: spacing.default,
    opacity: 1
  },
  buttonTitleStyle: {
    color: colors.white,
  },
  buttonTitleStyleSuccess: {
    color: colors.white
  },
  title: {
    fontSize: 28,
    marginBottom: spacing.large
  },
  subtitle: {
    color: colors.textLead,
    marginBottom: spacing.large
  }
});
