// tslint:disable: no-console
import React from 'react';
import { Modal, View } from 'react-native';
import TrackPlayer from 'react-native-track-player';
import { connect } from 'react-redux';

import { AudioPlayerLarge } from '../components/AudioPlayerLarge';
import { AudioPlayerSmall } from '../components/AudioPlayerSmall';
import { AudioPlayerSmallEmpty } from '../components/AudioPlayerSmallEmpty';
import { setPlaybackStatus } from '../reducers/player';

import { RootState } from '../reducers';
import { selectPlayerPlaybackState, selectPlayerTrack } from '../selectors/player';
import { selectAllPlaylistArticles } from '../selectors/playlist';

interface State {
  isLoading: boolean;
  isPlaying: boolean;
  showModal: boolean;
}

type Props = StateProps & DispatchProps;

class AudioPlayerContainerComponent extends React.PureComponent<Props, State> {
  state = {
    isLoading: true,
    isPlaying: false,
    showModal: false
  };

  onTrackChange: TrackPlayer.EmitterSubscription | null = null;
  onStateChanged: TrackPlayer.EmitterSubscription | null = null;
  onStateError: TrackPlayer.EmitterSubscription | null = null;
  onPlaybackQueueEnded: TrackPlayer.EmitterSubscription | null = null;

  componentDidMount(): void {
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

  async componentDidUpdate(prevProps: Props): Promise<void> {
    const { playbackState, track } = this.props;
    const { isPlaying } = this.state;

    // Detect if track changed
    if (track && track.url && prevProps.track.url !== track.url) {
      this.handleTrackUpdate(track);
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
    // "Only the id, url, title and artist properties are required for basic playback"
    // https://react-native-kit.github.io/react-native-track-player/documentation/#track-object

    if (!track.id || !track.url || !track.title || !track.artist) {
      console.warn('Cannot play track, missing a required track property.');
      return;
    }

    await TrackPlayer.reset();

    await TrackPlayer.add(track);

    await TrackPlayer.play();
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

  handleOnPressPlay = async () => {
    const { playbackState } = this.props;

    // Toggle play/pause/stop
    if (playbackState === 'playing' || playbackState === TrackPlayer.STATE_PLAYING) {
      await TrackPlayer.pause();
      return;
    }

    await TrackPlayer.play();
  }

  handleOnPressClose = () => this.setState({ showModal: false });

  handleOnShowModal = () => this.setState({ showModal: true });

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

  renderAudioPlayerLarge(): JSX.Element {
    const { isLoading, isPlaying } = this.state;

    return <AudioPlayerLarge article={this.article} isLoading={isLoading} isPlaying={isPlaying} onPressPlay={this.handleOnPressPlay} onPressClose={this.handleOnPressClose} onProgressChange={this.handleOnProgressChange} />;
  }

  render(): JSX.Element {
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
  track: ReturnType<typeof selectPlayerTrack>;
  playbackState: ReturnType<typeof selectPlayerPlaybackState>;
  articles: ReturnType<typeof selectAllPlaylistArticles>;
}

interface DispatchProps {
  setPlaybackStatus: typeof setPlaybackStatus;
}

const mapStateToProps = (state: RootState): StateProps => ({
  track: selectPlayerTrack(state),
  playbackState: selectPlayerPlaybackState(state),
  articles: selectAllPlaylistArticles(state)
});

const mapDispatchToProps: DispatchProps = {
  setPlaybackStatus
};

export const AudioPlayerContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(AudioPlayerContainerComponent);
