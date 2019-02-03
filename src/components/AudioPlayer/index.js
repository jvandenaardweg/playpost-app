import React from 'react';
import { View, Text, Button, TouchableOpacity } from 'react-native';
import styles from './styles';
import Icon from 'react-native-vector-icons/FontAwesome5'

export class AudioPlayer extends React.PureComponent {

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.progress}>
          <View><Text>00:10</Text></View>
          <View><Text>progress</Text></View>
          <View><Text>-01:10</Text></View>
        </View>
        <View style={styles.controls}>
          <View><Icon name="step-backward" color="white" size={20} /></View>
          <View style={styles.controlPlay}><Icon name="play" color="white" size={32} /></View>
          <View><Icon name="step-forward" color="white" size={20} /></View>
        </View>
      </View>
    );
  }
}
