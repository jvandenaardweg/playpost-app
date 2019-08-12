// tslint:disable: no-console
import debounce from 'lodash.debounce';
import React from 'react';
import TrackPlayer from 'react-native-track-player';
import { connect } from 'react-redux';

import { AudioPlayerLarge } from '../components/AudioPlayerLarge';
import { setPlaybackStatus } from '../reducers/player';
import { setPlaybackSpeed } from '../reducers/user';

import { RootState } from '../reducers';
import { selectPlayerArticleFromAudiofileId, selectPlayerIsLoading, selectPlayerIsPlaying, selectPlayerTrack } from '../selectors/player';
import { selectUserPlaybackSpeed } from '../selectors/user';

interface State {
  isPlaybackSpeedVisible: boolean;
}

type Props = StateProps & DispatchProps;

class LargeAudioPlayerContainerComponent extends React.PureComponent<Props, State> {
  state = {
    isPlaybackSpeedVisible: false
  };

  handleOnSetPlaybackSpeed = debounce(this.props.setPlaybackSpeed, 200);

  handleOnPressPlay = () => {
    const { userPlaybackSpeed, playerIsPlaying } = this.props;

    requestAnimationFrame(async () => {
      // Toggle play/pause/stop
      if (playerIsPlaying) {
        await TrackPlayer.pause();
        return;
      }

      // Else, we just play it from pause
      await TrackPlayer.play();

      // Make sure the playback speed is always in sync with the users setting
      await TrackPlayer.setRate(userPlaybackSpeed);
    });
  }

  handleOnProgressChange = async (percentage: number) => {
    const trackId = await TrackPlayer.getCurrentTrack();
    const track = await TrackPlayer.getTrack(trackId);

    if (track && track.duration) {
      const seekToSeconds = track.duration * percentage;
      await TrackPlayer.seekTo(seekToSeconds);
    }
  }

  handleOnTogglePlaybackSpeedVisibility = () => {
    requestAnimationFrame(() => this.setState({ isPlaybackSpeedVisible: !this.state.isPlaybackSpeedVisible }))
  }

  render() {
    const { isPlaybackSpeedVisible } = this.state;
    const { userPlaybackSpeed, article, playerIsPlaying, playerIsLoading } = this.props;

    return (
      <AudioPlayerLarge
        article={article}
        isLoading={playerIsLoading}
        isPlaying={playerIsPlaying}
        playbackSpeed={userPlaybackSpeed}
        isPlaybackSpeedVisible={isPlaybackSpeedVisible}
        onPressPlay={this.handleOnPressPlay}
        onProgressChange={this.handleOnProgressChange}
        onSetPlaybackSpeed={this.handleOnSetPlaybackSpeed}
        onTogglePlaybackSpeedVisibility={this.handleOnTogglePlaybackSpeedVisibility}
      />
    );
  }
}

interface StateProps {
  readonly track: ReturnType<typeof selectPlayerTrack>;
  readonly userPlaybackSpeed: ReturnType<typeof selectUserPlaybackSpeed>;
  readonly playerIsPlaying: ReturnType<typeof selectPlayerIsPlaying>;
  readonly playerIsLoading: ReturnType<typeof selectPlayerIsLoading>;
  readonly article: ReturnType<typeof selectPlayerArticleFromAudiofileId>;
}

interface DispatchProps {
  setPlaybackStatus: typeof setPlaybackStatus;
  setPlaybackSpeed: typeof setPlaybackSpeed;
}

const mapStateToProps = (state: RootState): StateProps => ({
  track: selectPlayerTrack(state),
  userPlaybackSpeed: selectUserPlaybackSpeed(state),
  playerIsPlaying: selectPlayerIsPlaying(state),
  playerIsLoading: selectPlayerIsLoading(state),
  article: selectPlayerArticleFromAudiofileId(state)
});

const mapDispatchToProps: DispatchProps = {
  setPlaybackStatus,
  setPlaybackSpeed
};

export const LargeAudioPlayerContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(LargeAudioPlayerContainerComponent);
