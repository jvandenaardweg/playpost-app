import React from 'react';
import { View, Text, Button, TouchableHighlight } from 'react-native';
import styles from './styles';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {
  Player,
  Recorder,
  MediaStates
} from 'react-native-audio-toolkit';

export class AudioPlayer extends React.PureComponent {
  state = {
    isDisabled: false,
    isPlaying: false
  }

  player = null

  componentDidMount () {
    console.log('mount', 'listen player')
  }

  handleOnPressPlay = (event) => {
    this.setState({isDisabled: true});

    this.player = new Player('https://storage.googleapis.com/synthesized-audio-files/medium.com/13eda868daeb.mp3');

    this.player.play();

    this.player.on('error', () => this.setState({ isDisabled: false, isPlaying: false}))
    this.player.on('ended', () => this.setState({ isDisabled: false, isPlaying: false}))
  }

  handleOnPressStop = (event) => {
    this.player.stop()
  }

  render() {
    const { isDisabled } = this.state;

    return (
      <View style={styles.container}>
        <View style={styles.progress}>
          <View><Text>00:10</Text></View>
          <View><Text>progress</Text></View>
          <View><Text>-01:10</Text></View>
        </View>
        <View style={styles.controls}>
          <View><Icon name="step-backward" color="white" size={20} /></View>
          <View>
            <TouchableHighlight disabled={isDisabled} onPress={this.handleOnPressPlay}>
              <Text>
                Press me!
              </Text>
            </TouchableHighlight>
          </View>
          <View style={styles.controlPlay}>
            <TouchableHighlight disabled={isDisabled} onPress={this.handleOnPressStop}>
              <Icon name="play" color="white" size={32} />
            </TouchableHighlight>
          </View>
          <View><Icon name="step-forward" color="white" size={20} /></View>
        </View>
      </View>
    );
  }
}
