import { StyleSheet } from 'react-native';

import Colors from '../../constants/colors';
import textInputStyle from '../../constants/text-input';

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 14
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
    backgroundColor: Colors.black,
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
    paddingTop: 6,
    maxWidth: 300,
  },
  footerText: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.paragraphGrayed,
    textAlign: 'center'
  },
  footerTextHighlight: {
    color: Colors.black
  }
});
