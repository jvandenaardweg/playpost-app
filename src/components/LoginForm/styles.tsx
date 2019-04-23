import { StyleSheet } from 'react-native';

import Colors from '../../constants/colors';
import textInputStyle from '../../constants/text-input';

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 14,
    backgroundColor: Colors.white
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
    marginBottom: 14
  },
  buttonTitleStyle: {
    color: Colors.white,
  },
  title: {
    fontSize: 34,
    lineHeight: 40,
    color: Colors.grayDark,
    fontWeight: '800'
  },
  subtitle: {
    fontSize: 18,
    lineHeight: 26,
    color: Colors.grayLight,
  }
});
