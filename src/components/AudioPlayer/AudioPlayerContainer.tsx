import React from 'react';
import { View, Modal, Alert } from 'react-native';
import { connect } from 'react-redux';
import TrackPlayer, { Track } from 'react-native-track-player';

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
}

type Props = StateProps & DispatchProps;

class AudioPlayerContainerComponent extends React.PureComponent<Props, State> {
  state = {
    isLoading: false,
    isPlaying: false,
    showModal: false
  };

  onTrackChange: any = {};
  onStateChanged: any = {};
  onStateError: any = {};

  async componentDidMount() {
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

    // await TrackPlayer.reset();

    // Adds an event handler for the playback-track-changed event
    this.onTrackChange = TrackPlayer.addEventListener('playback-track-changed', async ({ track, position, nextTrack }) => {
      console.log('Event', 'playback-track-changed', track, position, nextTrack);

      // if (nextTrack) {
      //   await TrackPlayer.getTrack(nextTrack);
      //   // await TrackPlayer.play();
      // }
    });

    this.onStateChanged = TrackPlayer.addEventListener('playback-state', async ({ state }) => {
      console.log('Event', 'playback-state', state);

      this.props.setPlaybackStatus(state);

      // Little trick to make sure autoplay works
      // From: https://github.com/react-native-kit/react-native-track-player/issues/479
      if (state === 'ready') {
        await TrackPlayer.play();
      }
    });

    this.onStateError = TrackPlayer.addEventListener('playback-error', ({ code, message }) => {
      console.log('Event', 'playback-error', code, message);
    });
  }

  async componentDidUpdate(prevProps: Props) {
    const { playbackState, track } = this.props;
    const { isLoading, isPlaying } = this.state;

    // Detect if track changed
    if (prevProps.track.id !== track.id) {
      this.handleTrackUpdate(track);
    }

    if (playbackState && [TrackPlayer.STATE_BUFFERING].includes(playbackState) && !isLoading) {
      this.setState({ isLoading: true });
    }

    // When a track is playing, update the state so we can show it as playing
    if (playbackState && [TrackPlayer.STATE_PLAYING].includes(playbackState) && !isPlaying) {
      this.setState({ isPlaying: true });
    }

    // When a track is loaded and ready to be played
    if (playbackState && ['ready', TrackPlayer.STATE_NONE, TrackPlayer.STATE_STOPPED, TrackPlayer.STATE_PAUSED].includes(playbackState) && (isLoading || isPlaying)) {
      this.setState({ isLoading: false, isPlaying: false });
    }
  }

  handleTrackUpdate = async (track: Track) => {
    console.log('Track updated');

    await TrackPlayer.reset();

    await TrackPlayer.add(track);

    await TrackPlayer.play();
    await TrackPlayer.play(); // Second play to make sure it starts. Seems to  be a bug in the package, https://github.com/react-native-kit/react-native-track-player/issues/479
  }

  componentWillUnmount() {
    this.onTrackChange.remove();
    this.onStateChanged.remove();
    this.onStateError.remove();
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

  renderAudioPlayerSmall() {
    const { track } = this.props;
    const { isLoading, isPlaying } = this.state;

    if (!track.id) {
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
    const { isLoading, isPlaying } = this.state;

    const article = articles.find((article) => {
      return article.audiofiles && article.audiofiles[0].id === track.id;
    });

    const articleText = article && article.text;

    return (
      <AudioPlayerLarge
        track={track}
        articleText={articleText}
        isLoading={isLoading}
        isPlaying={isPlaying}
        onPressPlay={this.handleOnPressPlay}
        onPressNext={this.handleOnPressNext}
        onPressPrevious={this.handleOnPressPrevious}
        onPressClose={this.handleOnPressClose}
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
  track: Track;
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
