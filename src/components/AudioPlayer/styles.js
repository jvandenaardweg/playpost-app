import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
      // flex: 1,
      backgroundColor: 'green',
      // flexDirection: 'column',
      padding: 14,
      borderBottomColor: '#EEF0F4',
      borderBottomWidth: 1,
    },
    progress: {
      flexDirection: 'row',
      justifyContent: 'space-between'
    },
    controls: {
      marginTop: 20,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center'
    },
    controlPlay: {
      marginLeft: 32,
      marginRight: 32
    }
});
