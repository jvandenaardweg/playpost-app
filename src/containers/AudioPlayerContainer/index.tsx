import React from 'react';
import { View, Modal, Button } from 'react-native';
import { connect } from 'react-redux';
import TrackPlayer from 'react-native-track-player';

import { setPlaybackStatus } from '../../reducers/player';

import { AudioPlayerSmall } from '../../components/AudioPlayer';

interface State {
  isDisabled: boolean
  track: any
  showModal: boolean
}

interface Props {
  changePlaybackStatus: any
  trackUrl: any
  playbackStatus: any
  track: any
}

class AudioPlayerContainerComponent extends React.PureComponent<Props, State> {
  state = {
    isDisabled: false,
    track: {},
    showModal: false
  }

  async componentDidMount() {
    const { changePlaybackStatus } = this.props;

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
      /* eslint-disable no-console */
      console.log('playback-track-changed', data);

      if (data.nextTrack) {
        const track = await TrackPlayer.getTrack(data.nextTrack);
        console.log('onTrackChange', 'update local state?', track);

        /*

        TrackStore.title = track.title;
          TrackStore.artist = track.artist;
          TrackStore.artwork = track.artwork;
          */
        this.setState({ track });
      }
    });

    this.onStateChanged = TrackPlayer.addEventListener('playback-state', (data) => {
      console.log('playback-state', data);
      changePlaybackStatus(data.state);
    });
  }

  async componentDidUpdate(prevProps: Props) {
    const { trackUrl, playbackStatus, track } = this.props;

    if (prevProps.playbackStatus === playbackStatus) {
      console.log('Playback status changed to ', playbackStatus);
    }

    if (prevProps.track !== track) {
      console.log('Track updated', track);
    }

    if (prevProps.trackUrl !== trackUrl) {
      console.log('Audioplayer got a new Track URL. We play it.');

      await TrackPlayer.reset();

      await TrackPlayer.add({
        id: track.id,
        // url: require('track.mp3'),
        url: trackUrl,
        title: track.title,
        artist: track.artist,
        album: track.album,
        // duration: 352
        // artwork: require('track.png')
      });

      await TrackPlayer.play();
    }
  }

  componentWillUnmount() {
    // Removes the event handler
    this.onTrackChange.remove();
    this.onStateChanged.remove();
  }

  handleOnPressPlay = async () => {
    const { playbackStatus } = this.props;

    try {
      if (playbackStatus === 'playing') {
        await TrackPlayer.stop();
      }

      await TrackPlayer.play();
    } catch (err) {
      /* eslint-disable no-console */
      console.log('Error', err);
    }
  }

  handleOnPressPause = async () => {
    try {
      await TrackPlayer.pause();
    } catch (err) {
      /* eslint-disable no-console */
      console.log('Error', err);
    }
  }

  skipToNext = async () => {
    try {
      await TrackPlayer.skipToNext();
    } catch (err) {
      /* eslint-disable no-console */
      console.log('Error', err);
    }
  }

  skipToPrevious = async () => {
    try {
      await TrackPlayer.skipToPrevious();
    } catch (err) {
      /* eslint-disable no-console */
      console.log('Error', err);
    }
  }

  handleOnModalClosePress = () => {
    this.setState({ showModal: false });
  }

  handleOnShowModal = () => {
    this.setState({ showModal: true });
  }

  render() {
    const { trackUrl, playbackStatus } = this.props;
    const { isDisabled, track, showModal } = this.state;

    return (
      <View>
        <Modal animationType="slide" presentationStyle="formSheet" transparent={false} visible={showModal}>
          <View style={{ paddingTop: 40, flex: 1, backgroundColor: '#000' }}>
            <Button onPress={this.handleOnModalClosePress} title="Close Full Player" />
            <AudioPlayerSmall
              track={track}
              trackUrl={trackUrl}
              isPlaying={playbackStatus === 'playing'}
              isDisabled={isDisabled}
              handleOnPressPlay={this.handleOnPressPlay}
              handleOnPressPause={this.handleOnPressPause}
              handleOnShowModal={this.handleOnShowModal}
            />
          </View>
        </Modal>
        <AudioPlayerSmall
          track={track}
          trackUrl={trackUrl}
          isPlaying={playbackStatus === 'playing'}
          isDisabled={isDisabled}
          handleOnPressPlay={this.handleOnPressPlay}
          handleOnPressPause={this.handleOnPressPause}
          handleOnShowModal={this.handleOnShowModal}
        />
      </View>

    );
  }
}

// let storedRepositories = articles.articles.map(repo => ({ key: repo.id, ...repo }));
const mapStateToProps = ({ player }) => ({
  trackUrl: player.trackUrl,
  track: player.track,
  playbackStatus: player.playbackStatus
});
const mapDispatchToProps = {
  changePlaybackStatus: setPlaybackStatus
};

export const AudioPlayerContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(AudioPlayerContainerComponent);
