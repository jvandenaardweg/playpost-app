import React from 'react';
import { View, Modal, Alert, NativeScrollEvent } from 'react-native';
import { connect } from 'react-redux';
import TrackPlayer from 'react-native-track-player';

import { setPlaybackStatus, PlaybackStatus } from '../../reducers/player';
import { AudioPlayerSmall, EmptyPlayer } from './AudioPlayerSmall';
import { AudioPlayerLarge } from './AudioPlayerLarge';

import { getPlayerPlaybackState, getPlayerTrack } from '../../selectors/player';
import { getDefaultPlaylistArticles } from '../../selectors/playlists';
import { RootState } from '../../reducers';

interface State {
  isLoading: boolean;
  isPlaying: boolean;
  showModal: boolean;
  scrolled: number;
}

type Props = StateProps & DispatchProps;

class AudioPlayerContainerComponent extends React.PureComponent<Props, State> {
  state = {
    isLoading: true,
    isPlaying: false,
    showModal: false,
    scrolled: 0,
  };

  onTrackChange: TrackPlayer.EmitterSubscription | null = null;
  onStateChanged: TrackPlayer.EmitterSubscription | null = null;
  onStateError: TrackPlayer.EmitterSubscription | null = null;
  scrollView = React.createRef();

  componentDidMount() {
    this.setupTrackPlayer();

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
    console.log('Track updated');

    // Reset the scrolled position for the Large Audio Player
    this.setState({ scrolled: 0 });

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

  handleOnPressNext = () => Alert.alert('Should play next article.');

  handleOnPressPrevious = () => Alert.alert('Should play previous article.');

  handleOnProgressChange = async (percentage: number) => {
    const trackId = await TrackPlayer.getCurrentTrack();
    const track = await TrackPlayer.getTrack(trackId);
    if (track && track.duration) {
      const seekToSeconds = track.duration * percentage;
      await TrackPlayer.seekTo(seekToSeconds);
    }
  }

  handleOnScroll = (event: { nativeEvent: NativeScrollEvent }) => {
    this.setState({ scrolled: event.nativeEvent.contentOffset.y });
  }

  renderAudioPlayerSmall() {
    const { track, articles } = this.props;
    const { isLoading, isPlaying } = this.state;

    if (!articles.length) return null;

    if (!track.id || track.album === 'Voice previews') {
      return (<EmptyPlayer />);
    }

    return (
      <AudioPlayerSmall
        track={track}
        isLoading={isLoading}
        isPlaying={isPlaying}
        onPressPlay={this.handleOnPressPlay}
        onPressShowModal={this.handleOnShowModal}
      />
    );
  }

  renderAudioPlayerLarge() {
    const { track, articles } = this.props;
    const { isLoading, isPlaying, scrolled } = this.state;

    const article = articles.find((article) => {
      if (!article.audiofiles.length) return false;

      return article.audiofiles[0].id === track.id;
    });

    const articleText = article && article.text;

    // TODO: make sure "scrolled" is changed when we change tracks
    return (
      <AudioPlayerLarge
        track={track}
        articleText={articleText}
        isLoading={isLoading}
        isPlaying={isPlaying}
        scrolled={scrolled}
        onPressPlay={this.handleOnPressPlay}
        onPressNext={this.handleOnPressNext}
        onPressPrevious={this.handleOnPressPrevious}
        onPressClose={this.handleOnPressClose}
        onScroll={this.handleOnScroll}
        onProgressChange={this.handleOnProgressChange}
      />
    );
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
  track: TrackPlayer.Track;
  playbackState: PlaybackStatus;
  articles: Api.Article[];
}

interface DispatchProps {
  setPlaybackStatus: (status: PlaybackStatus) => void;
}

const mapStateToProps = (state: RootState): StateProps => ({
  track: getPlayerTrack(state),
  playbackState: getPlayerPlaybackState(state),
  articles: getDefaultPlaylistArticles(state)
});

const mapDispatchToProps: DispatchProps = {
  setPlaybackStatus
};

export const AudioPlayerContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(AudioPlayerContainerComponent);
