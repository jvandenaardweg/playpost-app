// tslint:disable: no-console
import React from 'react';
import { EmitterSubscription } from 'react-native';
import * as TrackPlayer from 'react-native-track-player';
import { connect } from 'react-redux';

import { AudioPlayerSmall } from '../components/AudioPlayerSmall';
import { AudioPlayerSmallEmpty } from '../components/AudioPlayerSmallEmpty';
import { setPlaybackStatus } from '../reducers/player';
import { setPlaybackSpeed } from '../reducers/user';

import NavigationService from '../navigation/NavigationService';
import { RootState } from '../reducers';
import { selectPlayerIsLoading, selectPlayerIsPlaying, selectPlayerTrack } from '../selectors/player';
import { selectAllPlaylistArticles } from '../selectors/playlist';
import { selectUserPlaybackSpeed } from '../selectors/user';

interface State {
  isPlaybackSpeedVisible: boolean;
}

export type Props = StateProps & DispatchProps;

export class SmallAudioPlayerContainerComponent extends React.PureComponent<Props, State> {
  state = {
    isPlaybackSpeedVisible: false
  };

  onTrackChange: EmitterSubscription | null = null;
  onStateChanged: EmitterSubscription | null = null;
  onStateError: EmitterSubscription | null = null;
  onPlaybackQueueEnded: EmitterSubscription | null = null;

  componentDidMount() {
    this.setupTrackPlayer();
  }

  setupTrackPlayer = async () => {
    await TrackPlayer.default.setupPlayer();

    await TrackPlayer.default.updateOptions({
      stopWithApp: false,
      // icon: require('../assets/images/logo-1024.png'), // Keep commented for now, does not display our logo on Android
      capabilities: [
        TrackPlayer.Capability.Play,
        TrackPlayer.Capability.Pause,
        TrackPlayer.Capability.Stop,
        TrackPlayer.Capability.SeekTo
      ],
      compactCapabilities: [
        TrackPlayer.Capability.Play,
        TrackPlayer.Capability.Pause,
        TrackPlayer.Capability.Stop,
        TrackPlayer.Capability.SeekTo
      ],
      notificationCapabilities: [
        TrackPlayer.Capability.Play,
        TrackPlayer.Capability.Pause,
        TrackPlayer.Capability.Stop,
        TrackPlayer.Capability.SeekTo
      ]
    });

    this.onTrackChange = TrackPlayer.default.addEventListener(TrackPlayer.Event.PlaybackTrackChanged, async (data) => {
      console.log('Event', 'playback-track-changed', data);
    });

    this.onStateChanged = TrackPlayer.default.addEventListener(TrackPlayer.Event.PlaybackState, async ({ state }) => {
      console.log('Event', 'playback-state', state);
      this.props.setPlaybackStatus(state);
    });

    this.onStateError = TrackPlayer.default.addEventListener(TrackPlayer.Event.PlaybackError, (data) => {
      console.log('Event', 'playback-error', data);
    });

    this.onPlaybackQueueEnded = TrackPlayer.default.addEventListener(TrackPlayer.Event.PlaybackQueueEnded, async (data) => {
      const { track } = this.props;

      console.log('Event', 'playback-queue-ended', data);

      await TrackPlayer.default.stop();

      // Add the track to the player again, so the user can press "play" again when a track is finished
      await TrackPlayer.default.add(track);
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
      await TrackPlayer.default.setRate(userPlaybackSpeed);
    }
  }

  handleTrackUpdate = async (track: TrackPlayer.Track) => {
    const { userPlaybackSpeed } = this.props;

    // "Only the id, url, title and artist properties are required for basic playback"
    // https://react-native-kit.github.io/react-native-track-player/documentation/#track-object

    if (!track || !track.id || !track.url || !track.title || !track.artist) {
      console.warn('Cannot play track, missing a required track property.');
      return;
    }

    await TrackPlayer.default.reset();

    await TrackPlayer.default.add(track);

    await TrackPlayer.default.play();

    await TrackPlayer.default.setRate(userPlaybackSpeed);
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
        await TrackPlayer.default.pause();
        return;
      }

      // Else, we just play it from pause
      await TrackPlayer.default.play();

      // Make sure the playback speed is always in sync with the users setting
      await TrackPlayer.default.setRate(userPlaybackSpeed);
    });
  }

  handleOnPressShowFullPlayer = () => {
    requestAnimationFrame(() => NavigationService.navigate('FullAudioPlayer'));
  }

  render() {
    const { track, articles, playerIsLoading, playerIsPlaying } = this.props;

    if (!articles.length) { return null; }

    if (!track || !track.id) {
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
