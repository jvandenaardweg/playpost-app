import React from 'react';
import { View, Text, Button, TouchableHighlight } from 'react-native';
import styles from './styles';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {
  Player,
  Recorder,
  MediaStates
} from 'react-native-audio-toolkit';

import TrackPlayer from 'react-native-track-player';

export class AudioPlayer extends React.PureComponent {
  state = {
    isDisabled: false,
    isPlaying: false
  }

  player = null

  componentDidMount () {
    console.log('mount', 'listen player');
    // Adds an event handler for the playback-track-changed event
    this.onTrackChange = TrackPlayer.addEventListener('playback-track-changed', async (data) => {
            
      const track = await TrackPlayer.getTrack(data.nextTrack);
      this.setState({trackTitle: track.title});
      
  });
  }
  componentWillUnmount() {
    // Removes the event handler
    this.onTrackChange.remove();
}

  handleOnPressPlay = (event) => {
    this.setState({isDisabled: true});

    // this.player = new Player('https://storage.googleapis.com/synthesized-audio-files/medium.com/13eda868daeb.mp3');

    TrackPlayer.setupPlayer().then(async () => {

      // Adds a track to the queue
      await TrackPlayer.add({
          id: 'trackId',
          // url: require('track.mp3'),
          url: 'https://storage.googleapis.com/synthesized-audio-files/medium.com/13eda868daeb.mp3',
          title: 'Track Title',
          artist: 'Track Artist',
          // artwork: require('track.png')
      });
  
      // Starts playing it
      TrackPlayer.play();
  
  });

    // this.player.play();

    // this.player.on('error', () => this.setState({ isDisabled: false, isPlaying: false}))
    // this.player.on('ended', () => this.setState({ isDisabled: false, isPlaying: false}))
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
