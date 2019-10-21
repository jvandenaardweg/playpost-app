import React, { useRef } from 'react';
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
      controls
      repeat
      playInBackground={false}
      muted
      ref={videoPlayerRef}
      style={styles.container}
    />
  );
});
