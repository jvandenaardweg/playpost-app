import React from 'react';
import Video from 'react-native-video';

import styles from './styles';

interface Props {
  url?: string;
  source?: any;
}
export class VideoPlayer extends React.PureComponent<Props> {

  private videoPlayerRef: React.RefObject<Video> = React.createRef();

  handleOnBuffer = () => {};

  handleOnError = () => {};

  render() {
    const { url, source } = this.props;

    return (
      <Video source={(source) ? source : { uri: url }}   // Can be a URL or a local file.
        controls
        repeat
        // fullscreen
        ref={this.videoPlayerRef}
        onBuffer={this.handleOnBuffer} // Callback when remote video is buffering
        onError={this.handleOnError} // Callback when video cannot be loaded
        style={styles.container} />

    );
  }
}
