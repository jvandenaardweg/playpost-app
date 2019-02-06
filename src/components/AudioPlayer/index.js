import React from 'react';
import { View, Text, Button, TouchableHighlight } from 'react-native';
import styles from './styles';
import Icon from 'react-native-vector-icons/FontAwesome5';
import TrackPlayer, { ProgressComponent } from 'react-native-track-player';



class ProgressBar extends ProgressComponent {

  formatTime = (seconds) => {
    const ss = Math.floor(seconds) % 60;
    const mm = Math.floor(seconds / 60) % 60;
    const hh = Math.floor(seconds / 3600);

    if(hh > 0) {
      return hh + ':' + mm + ':' + ss;
    } else {
      return mm + ':' + ss;
    }
  }

  render() {
    const { position, duration, bufferedPosition } = this.state;
    return (
      <View style={styles.progressContainer}>
        {/* <Text>{(position / duration) * 100}</Text> */}
        {/* <Text>{this.formatTime(position)} - </Text> */}
        {/* <Text>{this.formatTime(duration)} - </Text> */}
        {/* <Text>{this.formatTime(bufferedPosition)}</Text> */}

        <View style={styles.progressBar}>
          <View style={{...styles.progressCurrent, flex: this.getProgress()}} />
          <View style={{...styles.progressTotal, flex: 1 - this.getProgress()}} />
        </View>
        <View style={styles.progressMeta}>
          <View><Text style={styles.position}>{position.toFixed(0)}</Text></View>
          <View><Text style={styles.duration}>{(position - duration).toFixed(2)}</Text></View>
        </View>
      </View>
    );
  }
}

export class AudioPlayer extends React.PureComponent {
  state = {
    isDisabled: false,
    isPlaying: false,
    track: {}
  }

  async componentDidMount () {
    await TrackPlayer.setupPlayer();

    await TrackPlayer.updateOptions({
      stopWithApp: false,
      capabilities: [
        TrackPlayer.CAPABILITY_PLAY,
        TrackPlayer.CAPABILITY_PAUSE,
        TrackPlayer.CAPABILITY_STOP,
        TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
        TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
        TrackPlayer.CAPABILITY_SEEK_TO
      ],
      compactCapabilities: [
        TrackPlayer.CAPABILITY_PLAY,
        TrackPlayer.CAPABILITY_PAUSE,
        TrackPlayer.CAPABILITY_STOP,
        TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
        TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
        TrackPlayer.CAPABILITY_SEEK_TO
      ]
    });

    await TrackPlayer.reset();

    // Adds an event handler for the playback-track-changed event
    this.onTrackChange = TrackPlayer.addEventListener('playback-track-changed', async (data) => {

      if (data.nextTrack) {
        const track = await TrackPlayer.getTrack(data.nextTrack)
        console.log('onTrackChange', 'update local state?', track)

        /*

        TrackStore.title = track.title;
          TrackStore.artist = track.artist;
          TrackStore.artwork = track.artwork;
          */
        // this.setState({ track, isDisabled: false, isPlaying: true })
      }

    })

    this.onStateChanged = TrackPlayer.addEventListener('playback-state', (data) => {
      console.log('playback-state', data.state)
      const isPlaying = data.state === 'playing'
      this.setState({ isPlaying })
    })
  }

  async componentDidUpdate(prevProps) {
    const { trackUrl } = this.props;

    if (prevProps.trackUrl !== this.props.trackUrl) {
      console.log('Audioplayer got a new Track URL. We play it.')

      await TrackPlayer.reset();

      await TrackPlayer.add({
        id: '13eda868daeb',
        // url: require('track.mp3'),
        url: trackUrl,
        title: 'Learn TypeScript in 5 minutes',
        artist: 'Per Harald Borgen',
        album: 'Medium.com',
        // duration: 352
        // artwork: require('track.png')
      })

      await TrackPlayer.play()
    }
  }

  componentWillUnmount() {
    // Removes the event handler
    this.onTrackChange.remove()
    this.onStateChanged.remove()
  }

  skipToNext = async () => {
    try {
      await TrackPlayer.skipToNext()
    } catch (_) {}
  }

  skipToPrevious = async () => {
    try {
      await TrackPlayer.skipToPrevious()
    } catch (_) {}
  }

  getStateName(state) {
    switch (state) {
      case TrackPlayer.STATE_NONE: return 'None'
      case TrackPlayer.STATE_PLAYING: return 'Playing'
      case TrackPlayer.STATE_PAUSED: return 'Paused'
      case TrackPlayer.STATE_STOPPED: return 'Stopped'
      case TrackPlayer.STATE_BUFFERING: return 'Buffering'
    }
  }

  handleOnPressPlay = async (event) => {
    const { isPlaying } = this.state;

    if (isPlaying) {
      await TrackPlayer.stop()
      // this.setState({ isPlaying: false })
    }

    await TrackPlayer.play()
    // this.setState({ isPlaying: true })
  }

  handleOnPressPause = async (event) => {
    await TrackPlayer.pause()
    // this.setState({ isPlaying: false })
  }

  render() {
    const { isDisabled, isPlaying } = this.state;

    return (
      <LargeAudioPlayer isDisabled={isDisabled} isPlaying={isPlaying} onPressPlay={this.handleOnPressPlay} onPressPause={this.handleOnPressPause} />
      // <SmallAudioPlayer isDisabled={isDisabled} isPlaying={isPlaying} onPress={this.handleOnPressPlay} />
    );
  }
}

const LargeAudioPlayer = (props) => {
  return (
    <View style={styles.container}>
      <ProgressBar />
      <View style={styles.controls}>
        <View><Icon name="step-backward" color="white" size={20} /></View>
        <View style={styles.controlPlay}>
          <PlayPauseButton {...props} />
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

const PlayPauseButton = (props) => {
  return (
    <TouchableHighlight onPress={(props.isPlaying) ? props.onPressPause : props.onPressPlay}>
      <PlayPauseIcon isPlaying={props.isPlaying} />
    </TouchableHighlight>
  )
}

const PlayPauseIcon = (props) => {
  if (props.isPlaying) return <Icon name="pause" color="white" size={32} />
  return <Icon name="play" color="white" size={32} />
}
