// tslint:disable: no-console
import React from 'react';
import { Alert } from 'react-native';
import TrackPlayer from 'react-native-track-player';
import { connect } from 'react-redux';

import { AudioPlayerLarge } from '../components/AudioPlayerLarge';
import { setPlaybackStatus } from '../reducers/player';
import { setPlaybackSpeed } from '../reducers/user';

import { ALERT_PLAYBACK_SPEED_SUBSCRIPTION_ONLY, ALERT_TITLE_SUBSCRIPTION_ONLY } from '../constants/messages';
import NavigationService from '../navigation/NavigationService';
import { RootState } from '../reducers';
import { selectPlayerArticleFromAudiofileId, selectPlayerIsLoading, selectPlayerIsPlaying, selectPlayerTrack } from '../selectors/player';
import { selectIsSubscribed } from '../selectors/subscriptions';
import { selectUserHasSubscribedBefore, selectUserPlaybackSpeed } from '../selectors/user';

interface State {
  isPlaybackSpeedVisible: boolean;
}

type Props = StateProps & DispatchProps;

class LargeAudioPlayerContainerComponent extends React.PureComponent<Props, State> {
  state = {
    isPlaybackSpeedVisible: false
  };

  setTrackPlayerPlaybackSpeed = (speed: number) => {
    const { isSubscribed } = this.props;

    // If a user is not subscribed, always set the speaking rate back to the default
    if (!isSubscribed) {
      this.props.setPlaybackSpeed(1);
      return TrackPlayer.setRate(1);
    }

    return TrackPlayer.setRate(speed);
  }

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
      await this.setTrackPlayerPlaybackSpeed(userPlaybackSpeed);
    });
  }

  handleOnSetPlaybackSpeed = (speed: number) => {
    requestAnimationFrame(() => this.props.setPlaybackSpeed(speed));
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
    const { isSubscribed, userHasSubscribedBefore } = this.props;

    if (!isSubscribed) {
      // Awalys reset it when the user clicks on it when not subscribed
      // So we can be sure the user always defaults back to 1 when his subscription expires
      this.props.setPlaybackSpeed(1);

      return Alert.alert(
        ALERT_TITLE_SUBSCRIPTION_ONLY,
        ALERT_PLAYBACK_SPEED_SUBSCRIPTION_ONLY,
        [
          {
            text: 'OK',
          },
          {
            text: (userHasSubscribedBefore) ? 'Upgrade' : 'Start free trial',
            style: 'cancel',
            onPress: () => {
              // Close the modal
              NavigationService.goBack({ key: null })

              requestAnimationFrame(() => {
                NavigationService.navigate('Upgrade')
              });
            }
          }
        ]
      );
    }

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
  readonly userHasSubscribedBefore: ReturnType<typeof selectUserHasSubscribedBefore>;
  readonly isSubscribed: ReturnType<typeof selectIsSubscribed>;
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
  userHasSubscribedBefore: selectUserHasSubscribedBefore(state),
  isSubscribed: selectIsSubscribed(state),
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
