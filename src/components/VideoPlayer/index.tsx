import React, { useRef } from 'react';
import { Platform } from 'react-native';
import Video from 'react-native-video';

import styles from './styles';

/* tslint:disable no-any */
interface Props {
  url?: string;
  localVideo?: any;
}

export const VideoPlayer: React.FC<Props> = React.memo((props) => {
  const videoPlayerRef = useRef<Video>(null);
  const source = (props.localVideo) ? props.localVideo : { uri: props.url };

  return (
    <Video
      source={source}
      resizeMode="cover"
      // Not showing controls on Android possibly fixes crashes on Android
      // https://github.com/react-native-community/react-native-video/issues/648
      controls={Platform.OS === 'android' ? false : true}
      repeat
      playInBackground={false}
      muted
      ref={videoPlayerRef}
      style={styles.container}
    />
  );
});
