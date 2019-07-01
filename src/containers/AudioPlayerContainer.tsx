import React from 'react';
import { View, Modal } from 'react-native';
import { connect } from 'react-redux';
import TrackPlayer from 'react-native-track-player';

import { setPlaybackStatus } from '../reducers/player';
import { AudioPlayerSmall } from '../components/AudioPlayerSmall';
import { AudioPlayerSmallEmpty } from '../components/AudioPlayerSmallEmpty';
import { AudioPlayerLarge } from '../components/AudioPlayerLarge';

import { selectPlayerPlaybackState, selectPlayerTrack } from '../selectors/player';
import { selectAllPlaylistArticles } from '../selectors/playlist';
import { RootState } from '../reducers';

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

    this.onTrackChange = TrackPlayer.addEventListener('playback-queue-ended', async ({ track, position }) => {
      console.log('Event', 'playback-queue-ended', track, position);
      TrackPlayer.stop();
    });
  }

  async componentDidUpdate(prevProps: Props) {
    const { playbackState, track } = this.props;
    const { isPlaying } = this.state;

    // Detect if track changed
    if (prevProps.track.id !== track.id) {
      this.handleTrackUpdate(track);
    }

    // When a track is playing
    if (playbackState && [TrackPlayer.STATE_PLAYING].includes(playbackState) && !isPlaying) {
      this.setState({ isPlaying: true, isLoading: false });
    }

    // When a track is stopped or paused
    if (playbackState && [TrackPlayer.STATE_STOPPED, TrackPlayer.STATE_PAUSED].includes(playbackState) && isPlaying) {
      this.setState({ isPlaying: false });
    }
  }

  handleTrackUpdate = async (track: TrackPlayer.Track) => {
    await TrackPlayer.reset();

    await TrackPlayer.add(track);

    await TrackPlayer.play();
  }

  componentWillUnmount() {
    this.onTrackChange && this.onTrackChange.remove();
    this.onStateChanged && this.onStateChanged.remove();
    this.onStateError && this.onStateError.remove();
  }

  handleOnPressPlay = async () => {
    const { playbackState } = this.props;

    // Toggle play/pause/stop
    if (playbackState === 'playing') {
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

  get article() {
    const { track, articles } = this.props;

    if (!track || !track.id) return;

    // Find the article based on the audiofile id
    const article = articles.find(article => {
      if (article.audiofiles.length) {
        const audiofile = article.audiofiles.find(audiofile => audiofile.id === track.id);
        if (audiofile) return true;
      }
      return false;
    });

    return article;
  }

  renderAudioPlayerSmall() {
    const { track, articles } = this.props;
    const { isLoading, isPlaying } = this.state;

    if (!articles.length) return null;

    if (!track.id) {
      return <AudioPlayerSmallEmpty />;
    }

    return <AudioPlayerSmall track={track} isLoading={isLoading} isPlaying={isPlaying} onPressPlay={this.handleOnPressPlay} onPressShowModal={this.handleOnShowModal} />;
  }

  renderAudioPlayerLarge() {
    const { isLoading, isPlaying } = this.state;

    return <AudioPlayerLarge article={this.article} isLoading={isLoading} isPlaying={isPlaying} onPressPlay={this.handleOnPressPlay} onPressClose={this.handleOnPressClose} onProgressChange={this.handleOnProgressChange} />;
  }

  render() {
    const { showModal } = this.state;

    return (
      <View>
        <Modal animationType="slide" presentationStyle="formSheet" transparent={false} visible={showModal}>
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
