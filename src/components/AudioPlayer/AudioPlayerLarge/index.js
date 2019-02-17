import React from 'react';
import {
  View, Text, TouchableHighlight
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
// import { ProgressComponent } from 'react-native-track-player';
import styles from './styles';

export class AudioPlayerLarge extends React.PureComponent {
  render() {
    const {
      handleOnPressPlay, handleOnPressPause, isPlaying, isDisabled, track: { title, artist, album }
    } = this.props;

    return (
      // <LargeAudioPlayer
      //   title={title}
      //   artist={artist}
      //   album={album}
      //   isDisabled={isDisabled}
      //   isPlaying={isPlaying}
      //   onPressPlay={handleOnPressPlay}
      //   onPressPause={handleOnPressPause} />
      <SmallAudioPlayer
        title={title}
        artist={artist}
        album={album}
        isDisabled={isDisabled}
        isPlaying={isPlaying}
        onPressPlay={handleOnPressPlay}
        onPressPause={handleOnPressPause}
      />
    );
  }
}

// const LargeAudioPlayer = (props) => {
//   return (
//     <View style={styles.container}>
//       <View>
//         <Text ellipsizeMode='tail' numberOfLines={1}>{props.title}</Text>
//       </View>
//       <View>
//         <Text ellipsizeMode='tail' numberOfLines={1}>{props.artist} - {props.album}</Text>
//       </View>
//       <ProgressBar />
//       <View style={styles.controls}>
//         <View><Icon name="step-backward" color="white" size={20} /></View>
//         <View style={styles.controlPlay}>
//           <PlayPauseButton {...props} size={32} />
//         </View>
//         <View><Icon name="step-forward" color="white" size={20} /></View>
//       </View>
//     </View>
//   )
// }

const SmallAudioPlayer = ({
  title,
  artist,
  album,
  ...restProps
}) => (
  <View style={styles.container}>
    <View style={styles.sideIcon}>
      <Text>icon</Text>
    </View>
    <View style={styles.trackInfo}>
      <View>
        <Text style={styles.trackInfoTitle} ellipsizeMode="tail" numberOfLines={1}>{title}</Text>
      </View>
      <View>
        <Text style={styles.trackInfoArtist} ellipsizeMode="tail" numberOfLines={1}>
          {artist}
          {' '}
-
          {' '}
          {album}
        </Text>
      </View>
    </View>
    <View style={styles.sideIcon}>
      <View style={styles.controlPlay}>
        <PlayPauseButton {...restProps} size={12} />
      </View>
    </View>
  </View>
);

const PlayPauseButton = ({
  isPlaying,
  onPressPause,
  onPressPlay
}) => (
  <TouchableHighlight onPress={(isPlaying) ? onPressPause : onPressPlay}>
    <PlayPauseIcon isPlaying={isPlaying} />
  </TouchableHighlight>
);

const PlayPauseIcon = ({
  isPlaying,
  size
}) => {
  if (isPlaying) return <Icon name="pause" color="white" size={size} />;
  return <Icon name="play" color="white" size={size} />;
};

// class ProgressBar extends ProgressComponent {
//   formatTime = (seconds) => {
//     const ss = Math.floor(seconds) % 60;
//     const mm = Math.floor(seconds / 60) % 60;
//     const hh = Math.floor(seconds / 3600);

//     if (hh > 0) {
//       return `${hh}:${mm}:${ss}`;
//     }
//     return `${mm}:${ss}`;
//   }

//   render() {
//     const { position, duration, bufferedPosition } = this.state;
//     return (
//       <View style={styles.progressContainer}>
//         {/* <Text>{(position / duration) * 100}</Text> */}
//         {/* <Text>{this.formatTime(position)} - </Text> */}
//         {/* <Text>{this.formatTime(duration)} - </Text> */}
//         {/* <Text>{this.formatTime(bufferedPosition)}</Text> */}

//         <View style={styles.progressBar}>
//           <View style={{ ...styles.progressCurrent, flex: this.getProgress() }} />
//           <View style={{ ...styles.progressTotal, flex: 1 - this.getProgress() }} />
//         </View>
//         <View style={styles.progressMeta}>
//           <View><Text style={styles.position}>{position.toFixed(0)}</Text></View>
//           <View><Text style={styles.duration}>{(position - duration).toFixed(2)}</Text></View>
//         </View>
//       </View>
//     );
//   }
// }
