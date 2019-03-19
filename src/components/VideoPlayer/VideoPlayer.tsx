import React from 'react';
import Video from 'react-native-video';

import styles from './styles';

/* tslint:disable no-any */
interface Props {
  url?: string;
  localVideo?: any;
}
export class VideoPlayer extends React.PureComponent<Props> {

  private videoPlayerRef: React.RefObject<Video> = React.createRef();

  handleOnBuffer = () => {};

  handleOnError = () => {};

  render() {
    const { url, localVideo } = this.props;

    const source = (localVideo) ? localVideo : { uri: url };

    return (
      <Video source={source}
        controls
        repeat
        playInBackground={false}
        ref={this.videoPlayerRef}
        onBuffer={this.handleOnBuffer} // Callback when remote video is buffering
        onError={this.handleOnError} // Callback when video cannot be loaded
        style={styles.container} />

    );
  }
}
