// tslint:disable: no-console
import React from 'react';
import { Alert } from 'react-native';
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
import { selectPlayerIsLoading, selectPlayerIsPlaying, selectPlayerIsStopped, selectPlayerTrack } from '../selectors/player';
import { selectAllPlaylistArticles } from '../selectors/playlist';
import { selectIsSubscribed } from '../selectors/subscriptions';
import { selectUserHasSubscribedBefore, selectUserPlaybackSpeed } from '../selectors/user';

interface State {
  isLoading: boolean;
  isPlaying: boolean;
  isPlaybackSpeedVisible: boolean;
}

interface IProps {
  isSmall?: boolean;
  isLarge?: boolean;
}

type Props = IProps & StateProps & DispatchProps;

class AudioPlayerContainerComponent extends React.PureComponent<Props, State> {

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

  static getDerivedStateFromProps(props: Props, state: State) {
    return {
      isPlaying: props.playerIsPlaying,
      isLoading: props.playerIsLoading
    };
  }

  state = {
    isLoading: false,
    isPlaying: false,
    isPlaybackSpeedVisible: false
  };

  onTrackChange: TrackPlayer.EmitterSubscription | null = null;
  onStateChanged: TrackPlayer.EmitterSubscription | null = null;
  onStateError: TrackPlayer.EmitterSubscription | null = null;
  onPlaybackQueueEnded: TrackPlayer.EmitterSubscription | null = null;

  componentDidMount() {
    this.setupTrackPlayer();
  }

  setupTrackPlayer = async () => {
    // const { userPlaybackSpeed } = this.props;

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

    // Do not set the playback speed/rate upon load, this might cause some crashes
    // Only set it right after "play"
    // await this.setTrackPlayerPlaybackSpeed(userPlaybackSpeed);

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
    const { isSubscribed } = this.props;

    // If a user is not subscribed, always set the speaking rate back to the default
    if (!isSubscribed) {
      this.props.setPlaybackSpeed(1);
      return TrackPlayer.setRate(1);
    }

    return TrackPlayer.setRate(speed);
  }

  async componentDidUpdate(prevProps: Props): Promise<void> {
    const { userPlaybackSpeed, track, isSubscribed } = this.props;

    // Detect if track changed
    if (track && track.url && prevProps.track.url !== track.url) {
      this.handleTrackUpdate(track);
    }

    if (isSubscribed && prevProps.userPlaybackSpeed !== userPlaybackSpeed) {
      await this.setTrackPlayerPlaybackSpeed(userPlaybackSpeed);
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

    await this.setTrackPlayerPlaybackSpeed(userPlaybackSpeed);
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
    const { userPlaybackSpeed, playerIsPlaying } = this.props;

    requestAnimationFrame(async () => {
      // Toggle play/pause/stop
      if (playerIsPlaying) {
        await TrackPlayer.pause();
        return;
      }

      await TrackPlayer.play();

      await this.setTrackPlayerPlaybackSpeed(userPlaybackSpeed);
    });
  }

  handleOnPressShowFullPlayer = () => {
    requestAnimationFrame(() => NavigationService.navigate('FullAudioPlayer'));
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
            text: (userHasSubscribedBefore) ? 'Upgrade to Premium or Plus' : 'Start free trial',
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
    const { isLoading, isPlaying, isPlaybackSpeedVisible } = this.state;
    const { isSmall, isLarge, userPlaybackSpeed, track, articles } = this.props;

    console.log('render audioplayercontainer');

    if (!articles.length) { return null; }

    if (isLarge) {
      return (
        <AudioPlayerLarge
          article={this.article}
          isLoading={isLoading}
          isPlaying={isPlaying}
          playbackSpeed={userPlaybackSpeed}
          isPlaybackSpeedVisible={isPlaybackSpeedVisible}
          onPressPlay={this.handleOnPressPlay}
          onProgressChange={this.handleOnProgressChange}
          onSetPlaybackSpeed={this.handleOnSetPlaybackSpeed}
          onTogglePlaybackSpeedVisibility={this.handleOnTogglePlaybackSpeedVisibility}
        />
      );
    }

    if (isSmall) {
      if (!track.id) {
        return <AudioPlayerSmallEmpty />;
      }

      return (
        <AudioPlayerSmall
          track={track}
          isLoading={isLoading}
          isPlaying={isPlaying}
          onPressPlay={this.handleOnPressPlay}
          onPressShowFullPlayer={this.handleOnPressShowFullPlayer}
        />
      );
    }

    return null;

  }
}

interface StateProps {
  readonly track: ReturnType<typeof selectPlayerTrack>;
  readonly userPlaybackSpeed: ReturnType<typeof selectUserPlaybackSpeed>;
  readonly userHasSubscribedBefore: ReturnType<typeof selectUserHasSubscribedBefore>;
  readonly articles: ReturnType<typeof selectAllPlaylistArticles>;
  readonly isSubscribed: ReturnType<typeof selectIsSubscribed>;
  readonly playerIsPlaying: ReturnType<typeof selectPlayerIsPlaying>;
  readonly playerIsLoading: ReturnType<typeof selectPlayerIsLoading>;
  readonly playerIsStopped: ReturnType<typeof selectPlayerIsStopped>;
}

interface DispatchProps {
  setPlaybackStatus: typeof setPlaybackStatus;
  setPlaybackSpeed: typeof setPlaybackSpeed;
}

const mapStateToProps = (state: RootState): StateProps => ({
  track: selectPlayerTrack(state),
  userPlaybackSpeed: selectUserPlaybackSpeed(state),
  userHasSubscribedBefore: selectUserHasSubscribedBefore(state),
  articles: selectAllPlaylistArticles(state),
  isSubscribed: selectIsSubscribed(state),
  playerIsPlaying: selectPlayerIsPlaying(state),
  playerIsLoading: selectPlayerIsLoading(state),
  playerIsStopped: selectPlayerIsStopped(state),
});

const mapDispatchToProps: DispatchProps = {
  setPlaybackStatus,
  setPlaybackSpeed
};

export const AudioPlayerContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(AudioPlayerContainerComponent);
