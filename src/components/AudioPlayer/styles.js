import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
      // flex: 1,
      backgroundColor: '#3B8062',
      // flexDirection: 'column',
      padding: 14
    },
    // progress: {
    //   flexDirection: 'row',
    //   justifyContent: 'space-between'
    // },
    controls: {
      marginTop: 20,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center'
    },
    controlPlay: {
      marginLeft: 32,
      marginRight: 32
    },
    progressContainer: {
      // flexDirection: 'row'
    },
    progressBar: {
      height: 5,
      marginTop: 7,
      borderRadius: 10,
      overflow: 'hidden',
      flexDirection: 'row'
    },
    progressMeta: {
      marginTop: 8,
      flexDirection: 'row',
      justifyContent: 'space-between'
    },
    progressTotal: {
      backgroundColor: '#000000',
      opacity: 0.25
    },
    progressCurrent: {
      backgroundColor: 'white'
    },
    position: {
      fontSize: 12,
      color: '#fff'
    },
    duration: {
      fontSize: 12,
      color: '#fff'
    }
});
