import { StyleSheet } from 'react-native';
import Colors from '@/constants/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.appBackground,
    // justifyContent: 'center',
    // alignItems: 'center',
    padding: 14,
    paddingTop: 186
  },
  form: {
    width: '100%'
  },
  textField: {
    height: 45,
    borderColor: 'lightgray',
    borderWidth: 1,
    borderRadius: 4,
    paddingLeft: 12,
    paddingRight: 12,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: 'white'
  },
  errorContainer: {
    minHeight: 20,
    marginBottom: 12
  },
  errorText: {
    color: 'red'
  },
  buttonStyle: {
    backgroundColor: Colors.black,
    height: 45
  },
  buttonTitleStyle: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 16
  }
  // formFooter: {

  // }
});
