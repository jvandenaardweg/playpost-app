// tslint:disable: no-console
import React from 'react';
import { Alert, InteractionManager, Modal, View } from 'react-native';
import TrackPlayer from 'react-native-track-player';
import { connect } from 'react-redux';

import { AudioPlayerLarge } from '../components/AudioPlayerLarge';
import { AudioPlayerSmall } from '../components/AudioPlayerSmall';
import { AudioPlayerSmallEmpty } from '../components/AudioPlayerSmallEmpty';
import { setPlaybackStatus } from '../reducers/player';
import { setPlaybackSpeed } from '../reducers/user';

import { ALERT_PLAYBACK_SPEED_SUBSCRIPTION_ONLY, ALERT_TITLE_SUBSCRIPTION_ONLY } from '../constants/messages';
import NavigationService from '../navigation/NavigationService';
import { RootState } from '../reducers';
import { selectPlayerPlaybackState, selectPlayerTrack } from '../selectors/player';
import { selectAllPlaylistArticles } from '../selectors/playlist';
import { selectIsSubscribed } from '../selectors/subscriptions';
import { selectUserHasSubscribedBefore, selectUserPlaybackSpeed } from '../selectors/user';

interface State {
  isLoading: boolean;
  isPlaying: boolean;
  showModal: boolean;
  isPlaybackSpeedVisible: boolean;
}

type Props = StateProps & DispatchProps;

class AudioPlayerContainerComponent extends React.PureComponent<Props, State> {
  state = {
    isLoading: true,
    isPlaying: false,
    showModal: false,
    isPlaybackSpeedVisible: false
  };

  onTrackChange: TrackPlayer.EmitterSubscription | null = null;
  onStateChanged: TrackPlayer.EmitterSubscription | null = null;
  onStateError: TrackPlayer.EmitterSubscription | null = null;
  onPlaybackQueueEnded: TrackPlayer.EmitterSubscription | null = null;

  componentDidMount(): void {
    InteractionManager.runAfterInteractions(() => {
      this.setupTrackPlayer();
    })
  }

  setupTrackPlayer = async () => {
    const { userPlaybackSpeed } = this.props;

    await TrackPlayer.setupPlayer();

    await TrackPlayer.updateOptions({
      stopWithApp: false,
      capabilities: [
        TrackPlayer.CAPABILITY_PLAY,
        TrackPlayer.CAPABILITY_PAUSE,
        TrackPlayer.CAPABILITY_STOP,
        // TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
        // TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
        TrackPlayer.CAPABILITY_SEEK_TO
      ],
      compactCapabilities: [
        TrackPlayer.CAPABILITY_PLAY,
        TrackPlayer.CAPABILITY_PAUSE,
        TrackPlayer.CAPABILITY_STOP,
        // TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
        // TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
        TrackPlayer.CAPABILITY_SEEK_TO
      ],
      notificationCapabilities: [
        TrackPlayer.CAPABILITY_PLAY,
        TrackPlayer.CAPABILITY_PAUSE,
        TrackPlayer.CAPABILITY_STOP,
        // TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
        // TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
        TrackPlayer.CAPABILITY_SEEK_TO
      ]
    });

    await this.setTrackPlayerPlaybackSpeed(userPlaybackSpeed);

    // Adds an event handler for the playback-track-changed event
    this.onTrackChange = TrackPlayer.addEventListener('playback-track-changed', async ({ track, position, nextTrack }) => {
      console.log('Event', 'playback-track-changed', track, position, nextTrack);
    });

    this.onStateChanged = TrackPlayer.addEventListener('playback-state', async ({ state }) => {
      console.log('Event', 'playback-state', state);
      this.props.setPlaybackStatus(state);
    });

    this.onStateError = TrackPlayer.addEventListener('playback-error', ({ code, message }) => {
      console.log('Event', 'playback-error', code, message);
    });

    this.onPlaybackQueueEnded = TrackPlayer.addEventListener('playback-queue-ended', async ({ track, position }) => {
      console.log('Event', 'playback-queue-ended', track, position);
      TrackPlayer.stop();
    });
  }

  setTrackPlayerPlaybackSpeed = (speed: number) => {
    console.log('setRate', speed);
    return TrackPlayer.setRate(speed);
  }

  async componentDidUpdate(prevProps: Props): Promise<void> {
    const { playbackState, userPlaybackSpeed, track } = this.props;
    const { isPlaying } = this.state;

    // Detect if track changed
    if (track && track.url && prevProps.track.url !== track.url) {
      this.handleTrackUpdate(track);
    }

    if (prevProps.userPlaybackSpeed !== userPlaybackSpeed) {
      await this.setTrackPlayerPlaybackSpeed(userPlaybackSpeed);
    }

    // When a track is playing
    if (playbackState && [TrackPlayer.STATE_PLAYING].includes(playbackState) && !isPlaying) {
      this.setState({ isPlaying: true, isLoading: false });
    }

    // When a track is stopped or paused
    if (playbackState && [TrackPlayer.STATE_STOPPED, TrackPlayer.STATE_PAUSED].includes(playbackState) && isPlaying) {
      this.setState({ isPlaying: false, isLoading: false });
    }
  }

  handleTrackUpdate = async (track: TrackPlayer.Track) => {
    const { userPlaybackSpeed } = this.props;

    // "Only the id, url, title and artist properties are required for basic playback"
    // https://react-native-kit.github.io/react-native-track-player/documentation/#track-object

    if (!track.id || !track.url || !track.title || !track.artist) {
      console.warn('Cannot play track, missing a required track property.');
      return;
    }

    await TrackPlayer.reset();

    await TrackPlayer.add(track);

    await TrackPlayer.play();

    await TrackPlayer.setRate(userPlaybackSpeed);
  }

  componentWillUnmount(): void {
    if(this.onTrackChange) {
      this.onTrackChange.remove();
    }
    if(this.onStateChanged) {
      this.onStateChanged.remove();
    }
    if(this.onStateError) {
      this.onStateError.remove();
    }
    if(this.onPlaybackQueueEnded) {
      this.onPlaybackQueueEnded.remove();
    }
  }

  handleOnPressPlay = () => {
    const { playbackState } = this.props;

    requestAnimationFrame(async () => {
      // Toggle play/pause/stop
      if (playbackState === 'playing' || playbackState === TrackPlayer.STATE_PLAYING) {
        await TrackPlayer.pause();
        return;
      }

      await TrackPlayer.play();
    });
  }

  handleOnPressClose = () => {
    requestAnimationFrame(() => this.setState({ showModal: false }));
  }

  handleOnShowModal = () => {
    requestAnimationFrame(() => this.setState({ showModal: true }));
  }

  handleOnSetPlaybackSpeed = (speed: number) => {
    const { isSubscribed, userHasSubscribedBefore } = this.props;

    if (!isSubscribed) {
      return Alert.alert(
        ALERT_TITLE_SUBSCRIPTION_ONLY,
        ALERT_PLAYBACK_SPEED_SUBSCRIPTION_ONLY,
        [
          {
            text: 'OK',
          },
          {
            text: (userHasSubscribedBefore) ? 'Upgrade to Premium or Plus' : 'Start free trial',
            style: 'cancel',
            onPress: () => {
              this.handleOnPressClose();

              requestAnimationFrame(() => {
                NavigationService.navigate('Upgrade')
              });
            }
          }
        ]
      );
    }

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

  get article(): Api.Article | undefined {
    const { track, articles } = this.props;

    if (!track || !track.id) { return; }

    // Find the article based on the audiofile id
    const foundArticle = articles.find(article => {
      if (article.audiofiles.length) {
        const foundAudiofile = article.audiofiles.find(audiofile => audiofile.id === track.id);
        if (foundAudiofile) { return true; }
      }
      return false;
    });

    return foundArticle;
  }

  renderAudioPlayerSmall(): JSX.Element | null {
    const { track, articles } = this.props;
    const { isLoading, isPlaying } = this.state;

    if (!articles.length) { return null; }

    if (!track.id) {
      return <AudioPlayerSmallEmpty />;
    }

    return <AudioPlayerSmall track={track} isLoading={isLoading} isPlaying={isPlaying} onPressPlay={this.handleOnPressPlay} onPressShowModal={this.handleOnShowModal} />;
  }

  handleOnTogglePlaybackSpeedVisibility = () => {
    requestAnimationFrame(() => this.setState({ isPlaybackSpeedVisible: !this.state.isPlaybackSpeedVisible }))
  }

  renderAudioPlayerLarge(): JSX.Element {
    const { isLoading, isPlaying, isPlaybackSpeedVisible } = this.state;
    const { userPlaybackSpeed } = this.props;

    return (
      <View style={{ flex: 1 }}>
        {/* <Modal
          animationType="slide"
          presentationStyle="overFullScreen"
          supportedOrientations={['portrait', 'landscape']}
          // For this share extension the debugger will tell you:
          // ExceptionsManager.js:82 Modal was presented with 0x2 orientations mask but the application only supports 0x0.Add more interface orientations to your app's Info.plist to fix this.
          // NOTE: This will crash in non-dev mode
          // Fun thing; this will NOT crash. You can ignore that error message
          // It's related to the modal being active in a share extension: https://github.com/facebook/react-native/issues/13951#issuecomment-339395236
          transparent
          visible={true}
        >
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.85)', padding: spacing.large }}>
            <PlaybackSpeedSlider playbackSpeed={userPlaybackSpeed} onSetPlaybackSpeed={this.handleOnSetPlaybackSpeed} />
          </View>
        </Modal> */}
        <AudioPlayerLarge
          article={this.article}
          isLoading={isLoading}
          isPlaying={isPlaying}
          playbackSpeed={userPlaybackSpeed}
          isPlaybackSpeedVisible={isPlaybackSpeedVisible}
          onPressPlay={this.handleOnPressPlay}
          onPressClose={this.handleOnPressClose}
          onProgressChange={this.handleOnProgressChange}
          onSetPlaybackSpeed={this.handleOnSetPlaybackSpeed}
          onTogglePlaybackSpeedVisibility={this.handleOnTogglePlaybackSpeedVisibility}
        />
      </View>

    );
  }

  render() {
    const { showModal } = this.state;

    return (
      <View>
        <Modal
          animationType="slide"
          presentationStyle="overFullScreen"
          transparent={false}
          visible={showModal}
        >
          {this.renderAudioPlayerLarge()}
        </Modal>
        {this.renderAudioPlayerSmall()}
      </View>
    );
  }
}

interface StateProps {
  readonly track: ReturnType<typeof selectPlayerTrack>;
  readonly playbackState: ReturnType<typeof selectPlayerPlaybackState>;
  readonly userPlaybackSpeed: ReturnType<typeof selectUserPlaybackSpeed>;
  readonly userHasSubscribedBefore: ReturnType<typeof selectUserHasSubscribedBefore>;
  readonly articles: ReturnType<typeof selectAllPlaylistArticles>;
  readonly isSubscribed: ReturnType<typeof selectIsSubscribed>;
}

interface DispatchProps {
  setPlaybackStatus: typeof setPlaybackStatus;
  setPlaybackSpeed: typeof setPlaybackSpeed;
}

const mapStateToProps = (state: RootState): StateProps => ({
  track: selectPlayerTrack(state),
  playbackState: selectPlayerPlaybackState(state),
  userPlaybackSpeed: selectUserPlaybackSpeed(state),
  userHasSubscribedBefore: selectUserHasSubscribedBefore(state),
  articles: selectAllPlaylistArticles(state),
  isSubscribed: selectIsSubscribed(state),
});

const mapDispatchToProps: DispatchProps = {
  setPlaybackStatus,
  setPlaybackSpeed
};

export const AudioPlayerContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(AudioPlayerContainerComponent);
