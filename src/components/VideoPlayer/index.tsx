import React, { useRef } from 'react';
import Video from 'react-native-video';

import styles from './styles';

/* tslint:disable no-any */
interface Props {
  url?: string;
  localVideo?: any;
}

export const VideoPlayer: React.FC<Props> = React.memo(({
  url,
  localVideo
}) => {
  const videoPlayerRef = useRef<Video>(null);
  const source = (localVideo) ? localVideo : { uri: url };

  return (
    <Video source={source}
      controls
      repeat
      playInBackground={false}
      ref={videoPlayerRef}
      style={styles.container}
    />
  );
});
