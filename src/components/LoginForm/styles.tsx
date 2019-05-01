import { StyleSheet } from 'react-native';

import colors from '../../constants/colors';

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
    marginBottom: 14
  },
  buttonTitleStyle: {
    color: colors.white,
  }
});
