import { StyleSheet } from 'react-native';

import colors from '../../constants/colors';
import fonts from '../../constants/fonts';
import textInputStyle from '../../constants/text-input';

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 14,
    backgroundColor: colors.appBackground
  },
  form: {
    width: '100%'
  },
  textField: textInputStyle,
  errorContainer: {
    minHeight: 20,
    marginBottom: 12
  },
  errorText: {
    color: 'red'
  },
  buttonStyle: {
    backgroundColor: colors.black,
    marginBottom: 14,
    opacity: 1
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
    fontSize: fonts.fontSize.body,
    lineHeight: 24,
    color: colors.paragraphGrayed,
    textAlign: 'center'
  },
  footerTextHighlight: {
    color: colors.black
  }
});
