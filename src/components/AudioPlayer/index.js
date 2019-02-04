import React from 'react';
import { View, Text, Button, TouchableHighlight } from 'react-native';
import styles from './styles';
import Icon from 'react-native-vector-icons/FontAwesome5';
import TrackPlayer from 'react-native-track-player';

export class AudioPlayer extends React.PureComponent {
  state = {
    isDisabled: false,
    isPlaying: false,
    track: {}
  }

  componentDidMount () {
    // Adds an event handler for the playback-track-changed event
    this.onTrackChange = TrackPlayer.addEventListener('playback-track-changed', async (data) => {
      const track = await TrackPlayer.getTrack(data.nextTrack)
      this.setState({ track, isDisabled: false, isPlaying: true })

    })
  }
  componentWillUnmount() {
    // Removes the event handler
    this.onTrackChange.remove()
}

  handleOnPressPlay = (event) => {
    this.setState({ isDisabled: true })

    TrackPlayer.setupPlayer().then(async () => {

      // Adds a track to the queue
      await TrackPlayer.add({
        id: '13eda868daeb',
        // url: require('track.mp3'),
        url: 'https://storage.googleapis.com/synthesized-audio-files/medium.com/13eda868daeb.mp3',
        title: 'Learn TypeScript in 5 minutes',
        artist: 'Per Harald Borgen',
        // artwork: require('track.png')
      })

      TrackPlayer.play()
    })
  }

  handleOnPressStop = (event) => {
    this.player.stop()
  }

  render() {
    const { isDisabled, isPlaying } = this.state;

    return (
      <LargeAudioPlayer isDisabled={isDisabled} isPlaying={isPlaying} onPress={this.handleOnPressPlay} />
      // <SmallAudioPlayer isDisabled={isDisabled} isPlaying={isPlaying} onPress={this.handleOnPressPlay} />
    );
  }
}

const LargeAudioPlayer = (props) => {
  return (
    <View style={styles.container}>
      <View style={styles.progress}>
        <View><Text>00:10</Text></View>
        <View><Text>progress</Text></View>
        <View><Text>-01:10</Text></View>
      </View>
      <View style={styles.controls}>
        <View><Icon name="step-backward" color="white" size={20} /></View>
        <View style={styles.controlPlay}>
          <TouchableHighlight disabled={props.isDisabled} onPress={props.onPress}>
            <PlayPauseIcon isPlaying={props.isPlaying} />
          </TouchableHighlight>
        </View>
        <View><Icon name="step-forward" color="white" size={20} /></View>
      </View>
    </View>
  )
}

const SmallAudioPlayer = (props) => {
  return (
    <View style={styles.container}>
      <View style={styles.controls}>
        <View style={styles.controlPlay}>
          <TouchableHighlight disabled={props.isDisabled} onPress={props.onPress}>
            <PlayPauseIcon isPlaying={props.isPlaying} />
          </TouchableHighlight>
        </View>
      </View>
    </View>
  )
};

const PlayPauseIcon = ({ isPlaying }) => {
  if (isPlaying) return <Icon name="pause" color="white" size={32} />
  return <Icon name="play" color="white" size={32} />
}
