import { StyleSheet } from 'react-native';

import colors from '../../constants/colors';
import spacing from '../../constants/spacing';
import textInputStyle from '../../constants/text-input';

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.large
  },
  form: {
    width: '100%'
  },
  textField: textInputStyle,
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
    alignItems: 'center'
  },
  footer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    textAlign: 'center',
    maxWidth: 300
  },
  footerText: {
    color: colors.paragraphGrayed,
    textAlign: 'center'
  },
  footerTextHighlight: {
    color: colors.black
  }
});
