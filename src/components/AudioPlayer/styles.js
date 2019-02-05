import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
      // flex: 1,
      backgroundColor: 'green',
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
      flexDirection: 'row'
    },
    progressBar: {
      height: 5,
      width: '75%',
      // marginLeft: 'auto',
      // marginRight: 'auto',
      marginTop: 7,
      // flexDirection: 'row',
      borderRadius: 10,
      overflow: 'hidden'
    },
    progressTotal: {
      backgroundColor: '#000000',
      opacity: 0.25
    },
    progressCurrent: {
      backgroundColor: 'white'
    },
    position: {
      marginRight: 'auto'
    },
    duration: {
      marginLeft: 'auto'
    }
});
