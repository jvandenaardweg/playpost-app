import React from 'react';
// import isEqual from 'react-fast-compare';
import { View } from 'react-native';
import { useProgress } from 'react-native-track-player';

import styles from './styles';

export const AudioPlayerSmallProgressBar: React.FC = React.memo(() => {

  const progress = useProgress();

  let percentage = 0;
  const { position, duration } = progress;

  if (position && duration) {
    percentage = position / duration;
  }
  return (
    <View style={styles.container}>
      <View style={[styles.progress, { width: `${percentage * 100}%` }]} />
    </View>
  )
});

// export class AudioPlayerSmallProgressBar extends ProgressComponent<any, State> {
//   shouldComponentUpdate(nextProps: any, nextState: State) {
//     return !isEqual(this.state, nextState);
//   }

//   render() {
//     let percentage = 0;
//     const { position, duration } = this.state;

//     if (position && duration) {
//       percentage = position / duration;
//     }

//     return (
//       <View style={styles.container}>
//         <View style={[styles.progress, { width: `${percentage * 100}%` }]} />
//       </View>
//     );
//   }
// }
