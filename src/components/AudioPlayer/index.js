import React from 'react';
import { View, Text, Button, TouchableHighlight } from 'react-native';
import styles from './styles';
import Icon from 'react-native-vector-icons/FontAwesome5';
import TrackPlayer, { ProgressComponent } from 'react-native-track-player';

export class AudioPlayer extends React.PureComponent {

  render() {
    const { handleOnPressPlay, handleOnPressPause, isPlaying, isDisabled, track: { title, artist, album } } = this.props;

    return (
      <LargeAudioPlayer
        title={title}
        artist={artist}
        album={album}
        isDisabled={isDisabled}
        isPlaying={isPlaying}
        onPressPlay={handleOnPressPlay}
        onPressPause={handleOnPressPause} />
      // <SmallAudioPlayer isDisabled={isDisabled} isPlaying={isPlaying} onPress={this.handleOnPressPlay} />
    );
  }
}

const LargeAudioPlayer = (props) => {
  return (
    <View style={styles.container}>
      <View>
        <Text ellipsizeMode='tail' numberOfLines={1}>{props.title}</Text>
      </View>
      <View>
        <Text ellipsizeMode='tail' numberOfLines={1}>{props.artist} - {props.album}</Text>
      </View>
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
