import React from 'react';
import { View, Modal, Button } from 'react-native';
import { connect } from 'react-redux';
import TrackPlayer, { Track } from 'react-native-track-player';

import { setPlaybackStatus, PlayerState } from '../../reducers/player';
import { AudioPlayerSmall, EmptyPlayer } from '../../components/AudioPlayer';

interface State {
  isLoading: boolean;
  isPlaying: boolean;
  showModal: boolean;
}

interface Props {
  setPlaybackStatus: any;
  player: PlayerState;
}

class AudioPlayerContainerComponent extends React.PureComponent<Props, State> {
  state = {
    isLoading: false,
    isPlaying: false,
    showModal: false
  };

  onTrackChange: any = {};
  onStateChanged: any = {};

  async componentDidMount() {
    await TrackPlayer.setupPlayer();

    await TrackPlayer.updateOptions({
      stopWithApp: false,
      capabilities: [
        TrackPlayer.CAPABILITY_PLAY,
        TrackPlayer.CAPABILITY_PAUSE,
        TrackPlayer.CAPABILITY_STOP,
        TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
        TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
        TrackPlayer.CAPABILITY_SEEK_TO
      ],
      compactCapabilities: [
        TrackPlayer.CAPABILITY_PLAY,
        TrackPlayer.CAPABILITY_PAUSE,
        TrackPlayer.CAPABILITY_STOP,
        TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
        TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
        TrackPlayer.CAPABILITY_SEEK_TO
      ],
      notificationCapabilities: [
        TrackPlayer.CAPABILITY_PLAY,
        TrackPlayer.CAPABILITY_PAUSE,
        TrackPlayer.CAPABILITY_STOP,
        TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
        TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
        TrackPlayer.CAPABILITY_SEEK_TO
      ]
    });

    await TrackPlayer.reset();

    // Adds an event handler for the playback-track-changed event
    // this.onTrackChange = TrackPlayer.addEventListener('playback-track-changed', async ({ nextTrack, track }) => {
    //   console.log('Event', 'playback-track-changed', nextTrack, track);

    //   if (nextTrack && track) {
    //     console.log('Event', 'playback-track-changed', 'Changed track!', nextTrack);
    //     await TrackPlayer.getTrack(nextTrack);
    //   }
    // });

    this.onStateChanged = TrackPlayer.addEventListener('playback-state', ({ state }) => {
      console.log('Event', 'playback-state', state);
      this.props.setPlaybackStatus(state);
    });
  }

  async componentDidUpdate(prevProps: Props) {
    const { track, playbackState } = this.props.player;
    const { isLoading, isPlaying } = this.state;

    // Detect if track changed
    if (prevProps.player.track.id !== track.id) {
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

  async handleTrackUpdate(track: Track) {
    console.log('Track updated', track);

    await TrackPlayer.reset();

    await TrackPlayer.add(track);

    await TrackPlayer.play();
  }

  componentWillUnmount() {
    this.onTrackChange.remove();
    this.onStateChanged.remove();
  }

  handleOnPressPlay = async () => {
    const { playbackState } = this.props.player;

    // Toggle play/pause/stop
    if (playbackState === 'playing') {
      await TrackPlayer.pause();
      return;
    }

    await TrackPlayer.play();
  }

  handleOnModalClosePress = () => this.setState({ showModal: false });

  handleOnShowModal = () => this.setState({ showModal: true });

  renderAudioPlayerSmall() {
    const { track } = this.props.player;
    const { isLoading, isPlaying } = this.state;

    if (!track.id) {
      return (<EmptyPlayer />);
    }

    return (
      <AudioPlayerSmall
        track={track}
        isLoading={isLoading}
        isPlaying={isPlaying}
        handleOnPressPlay={this.handleOnPressPlay}
        handleOnShowModal={this.handleOnShowModal}
      />
    );
  }

  render() {
    const { showModal } = this.state;

    return (
      <View>
        <Modal animationType="slide" presentationStyle="formSheet" transparent={false} visible={showModal}>
          <View style={{ paddingTop: 40, flex: 1, backgroundColor: '#000' }}>
            <Button onPress={this.handleOnModalClosePress} title="Close Full Player" />
            {this.renderAudioPlayerSmall()}
          </View>
        </Modal>
        {this.renderAudioPlayerSmall()}
      </View>

    );
  }
}

// let storedRepositories = articles.articles.map(repo => ({ key: repo.id, ...repo }));
const mapStateToProps = (state: { player: PlayerState }) => ({
  player: state.player,
});
const mapDispatchToProps = {
  setPlaybackStatus
};

export const AudioPlayerContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(AudioPlayerContainerComponent);
