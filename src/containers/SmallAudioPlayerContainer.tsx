// tslint:disable: no-console
import React from 'react';
import TrackPlayer from 'react-native-track-player';
import { connect } from 'react-redux';

import { AudioPlayerSmall } from '../components/AudioPlayerSmall';
import { AudioPlayerSmallEmpty } from '../components/AudioPlayerSmallEmpty';
import { setPlaybackStatus } from '../reducers/player';
import { setPlaybackSpeed } from '../reducers/user';

import NavigationService from '../navigation/NavigationService';
import { RootState } from '../reducers';
import { selectPlayerIsLoading, selectPlayerIsPlaying, selectPlayerTrack } from '../selectors/player';
import { selectAllPlaylistArticles } from '../selectors/playlist';
import { selectUserHasSubscribedBefore, selectUserPlaybackSpeed } from '../selectors/user';

interface State {
  isPlaybackSpeedVisible: boolean;
}

type Props = StateProps & DispatchProps;

class SmallAudioPlayerContainerComponent extends React.PureComponent<Props, State> {
  state = {
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

    // Adds an event handler for the playback-track-changed event
    this.onTrackChange = TrackPlayer.addEventListener('playback-track-changed', async (data) => {
      console.log('Event', 'playback-track-changed', data);
    });

    this.onStateChanged = TrackPlayer.addEventListener('playback-state', async ({ state }) => {
      console.log('Event', 'playback-state', state);
      this.props.setPlaybackStatus(state);
    });

    this.onStateError = TrackPlayer.addEventListener('playback-error', (data) => {
      console.log('Event', 'playback-error', data);
    });

    this.onPlaybackQueueEnded = TrackPlayer.addEventListener('playback-queue-ended', async (data) => {
      const { track } = this.props;

      console.log('Event', 'playback-queue-ended', data);

      await TrackPlayer.stop();

      // Add the track to the player again, so the user can press "play" again when a track is finished
      await TrackPlayer.add(track);
    });
  }

  async componentDidUpdate(prevProps: Props): Promise<void> {
    const { userPlaybackSpeed, track } = this.props;

    // Detect if track changed
    if (track && track.url && prevProps.track.url !== track.url) {
      this.handleTrackUpdate(track);
    }

    // Change the playback speed when the user changed that setting
    if (prevProps.userPlaybackSpeed !== userPlaybackSpeed) {
      await TrackPlayer.setRate(userPlaybackSpeed);
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

  handleOnPressShowFullPlayer = () => {
    requestAnimationFrame(() => NavigationService.navigate('FullAudioPlayer'));
  }

  render() {
    const { track, articles, playerIsLoading, playerIsPlaying } = this.props;

    if (!articles.length) { return null; }

    if (!track.id) {
      return <AudioPlayerSmallEmpty />;
    }

    return (
      <AudioPlayerSmall
        track={track}
        isLoading={playerIsLoading}
        isPlaying={playerIsPlaying}
        onPressPlay={this.handleOnPressPlay}
        onPressShowFullPlayer={this.handleOnPressShowFullPlayer}
      />
    );
  }
}

interface StateProps {
  readonly track: ReturnType<typeof selectPlayerTrack>;
  readonly userPlaybackSpeed: ReturnType<typeof selectUserPlaybackSpeed>;
  readonly userHasSubscribedBefore: ReturnType<typeof selectUserHasSubscribedBefore>;
  readonly articles: ReturnType<typeof selectAllPlaylistArticles>;
  readonly playerIsPlaying: ReturnType<typeof selectPlayerIsPlaying>;
  readonly playerIsLoading: ReturnType<typeof selectPlayerIsLoading>;
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
  playerIsPlaying: selectPlayerIsPlaying(state),
  playerIsLoading: selectPlayerIsLoading(state)
});

const mapDispatchToProps: DispatchProps = {
  setPlaybackStatus,
  setPlaybackSpeed
};

export const SmallAudioPlayerContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(SmallAudioPlayerContainerComponent);
