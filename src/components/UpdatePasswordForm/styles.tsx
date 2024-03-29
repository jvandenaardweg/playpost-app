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
    padding: spacing.large,
    backgroundColor: (theme === UserTheme.dark) ? colors.gray900 : colors.white
  },
  form: {
    width: '100%'
  },
  textField: textInputStyle(theme),
  buttonStyle: {
    backgroundColor: colors.black,
    marginBottom: spacing.default,
    opacity: 1
  },
  buttonStyleSuccess: {
    backgroundColor: colors.green,
    marginBottom: spacing.default,
    opacity: 1
  },
  buttonTitleStyleSuccess: {
    color: colors.white
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
  },
  footerText: {
    color: colors.gray900,
    textAlign: 'center'
  },
  footerTextHighlight: {
    color: colors.black
  }
});
