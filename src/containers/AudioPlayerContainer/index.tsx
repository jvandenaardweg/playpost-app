import React from 'react';
import { View, Modal, Button } from 'react-native';
import { connect } from 'react-redux';
import TrackPlayer, { Track } from 'react-native-track-player';

import { setPlaybackStatus, PlayerState } from '../../reducers/player';
import { AudioPlayerSmall, EmptyPlayer } from '../../components/AudioPlayer';

interface State {
  isDisabled: boolean;
  showModal: boolean;
}

interface Props {
  setPlaybackStatus: any;
  player: PlayerState;
}

class AudioPlayerContainerComponent extends React.PureComponent<Props, State> {
  state = {
    isDisabled: false,
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
    this.onTrackChange = TrackPlayer.addEventListener('playback-track-changed', async (data) => {
      console.log('Event', 'playback-track-changed', data);

      if (data.nextTrack) {
        console.log('Event', 'playback-track-changed', 'Changed track!', data.nextTrack);
        await TrackPlayer.getTrack(data.nextTrack);
      }
    });

    this.onStateChanged = TrackPlayer.addEventListener('playback-state', ({ state }) => {
      console.log('Event', 'playback-state', state);
      this.props.setPlaybackStatus(state);
    });
  }

  async componentDidUpdate(prevProps: Props) {
    const { track } = this.props.player;

    // Detect if track changed
    if (prevProps.player.track.id !== track.id) {
      this.handleTrackUpdate(track);
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
    const { playbackStatus } = this.props.player;

    // Toggle play/pause/stop
    if (playbackStatus === 'playing') {
      await TrackPlayer.pause();
      return;
    }

    await TrackPlayer.play();
  }

  handleOnPressPause = async () => {
    try {
      await TrackPlayer.pause();
    } catch (err) {
      console.log('Error handleOnPressPause', err);
    }
  }

  handleOnModalClosePress = () => {
    this.setState({ showModal: false });
  }

  handleOnShowModal = () => {
    this.setState({ showModal: true });
  }

  renderAudioPlayerSmall() {
    const { track, playbackStatus } = this.props.player;
    const { isDisabled } = this.state;

    if (!track.id) {
      return (<EmptyPlayer />);
    }

    return (
      <AudioPlayerSmall
        track={track}
        trackUrl={track.url}
        isPlaying={playbackStatus === 'playing'}
        isDisabled={isDisabled}
        handleOnPressPlay={this.handleOnPressPlay}
        handleOnPressPause={this.handleOnPressPause}
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
