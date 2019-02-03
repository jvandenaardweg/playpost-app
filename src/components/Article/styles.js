import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
      // flex: 1,
      backgroundColor: '#fff',
      // flexDirection: 'column',
      padding: 14,
      borderBottomColor: '#EEF0F4',
      borderBottomWidth: 1,
    },
    header: {

    },
    body: {
      flex: 1,
      flexDirection: 'row'
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
      marginBottom: 4
    },
    author: {
      fontSize: 13,
      color: '#aaa',
      lineHeight: 19
    },
    source: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'baseline'
    },
    sourceIcon: {
      color: '#555'
    },
    sourceName: {
      fontSize: 13,
      color: '#555',
      marginBottom: 8,
      marginLeft: 6
    },
    authorName: {
      color: '#555'
    },
    publicationName: {
      color: '#555'
    },
    controlButton: {
      backgroundColor: 'green',
      width: 50,
      height: 50,
      borderRadius: 50,
      alignItems: 'center',
      justifyContent: 'center'
    },
    controlIcon: {
      marginLeft: 2
    },
    duration: {
      color: 'green',
      textAlign: 'center',
      marginTop: 14,
      fontSize: 13
    }
});
