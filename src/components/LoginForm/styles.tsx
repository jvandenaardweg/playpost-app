import { StyleSheet } from 'react-native';

import colors from '../../constants/colors';

import spacing from '../../constants/spacing';
import textInputStyle from '../../constants/text-input';
import { UserTheme } from '../../reducers/user';

export default (theme: UserTheme) => StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: spacing.large
  },
  form: {
    width: '100%'
  },
  formContent: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'column',
    width: '100%'
  },
  textField: textInputStyle(theme),
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
