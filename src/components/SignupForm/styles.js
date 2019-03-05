import { StyleSheet } from 'react-native';
import Colors from '@/constants/colors';
import textInputStyle from '@/constants/text-input';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.appBackground,
    padding: 14,
    paddingTop: 124
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
    height: 50,
    marginBottom: 14
  },
  buttonTitleStyle: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 16
  }
});
