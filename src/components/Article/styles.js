import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      flexDirection: 'row',
      padding: 14,
      borderBottomColor: '#EEF0F4',
      borderBottomWidth: 1,
    },
    meta: {
      flex: 1,
      flexDirection: 'column',
      alignItems: 'stretch',
      justifyContent: 'space-between',
      // backgroundColor: 'yellow'
    },
    control: {
      width: 50,
      justifyContent: 'center',
      // backgroundColor: 'red',
      marginLeft: 24
    },
    title: {
      fontSize: 16,
      fontWeight: '600',
      color: '#000000',
      lineHeight: 22,
      marginBottom: 4
    },
    description: {
      fontSize: 13,
      color: '#aaa',
      lineHeight: 19,
      marginBottom: 14
    },
    author: {
      fontSize: 13,
      color: '#aaa',
      lineHeight: 19,
    },
    authorName: {
      color: '#555'
    },
    publicationName: {
      color: '#555'
    },
    button: {
      backgroundColor: 'green',
      width: 50,
      height: 50,
      borderRadius: 50,
      alignItems: 'center',
      justifyContent: 'center'
    },
    duration: {
      color: 'green',
      textAlign: 'center',
      marginTop: 14,
      fontSize: 13
    }
});
