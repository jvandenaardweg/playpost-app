import React from 'react';
import { FlatList } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import TrackPlayer, { ProgressComponent } from 'react-native-track-player';

import { setPlaybackStatus } from '../../reducers/player';

// import styles from './styles';

import { AudioPlayer } from '../../components/AudioPlayer';


class AudioPlayerContainerComponent extends React.PureComponent {
  state = {
    isDisabled: false,
    track: {}
  }

  async componentDidMount () {
    await TrackPlayer.setupPlayer()

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
      ]
    })

    await TrackPlayer.reset()

    // Adds an event handler for the playback-track-changed event
    this.onTrackChange = TrackPlayer.addEventListener('playback-track-changed', async (data) => {
      console.log('playback-track-changed', data)

      if (data.nextTrack) {
        const track = await TrackPlayer.getTrack(data.nextTrack)
        console.log('onTrackChange', 'update local state?', track)

        /*

        TrackStore.title = track.title;
          TrackStore.artist = track.artist;
          TrackStore.artwork = track.artwork;
          */
        this.setState({ track })
      }

    })

    this.onStateChanged = TrackPlayer.addEventListener('playback-state', (data) => {
      console.log('playback-state', data)
      this.props.setPlaybackStatus(data.state)
    })
  }

  async componentDidUpdate(prevProps) {
    const { trackUrl, playbackStatus, track } = this.props

    if (prevProps.playbackStatus === playbackStatus) {
      console.log('Playback status changed to ', playbackStatus)
    }

    if (prevProps.track !== track) {
      console.log('Track updated', track)
    }

    if (prevProps.trackUrl !== this.props.trackUrl) {
      console.log('Audioplayer got a new Track URL. We play it.')

      await TrackPlayer.reset()

      await TrackPlayer.add({
        id: track.id,
        // url: require('track.mp3'),
        url: trackUrl,
        title: track.title,
        artist: track.artist,
        album: track.album,
        // duration: 352
        // artwork: require('track.png')
      })

      await TrackPlayer.play()
    }
  }

  componentWillUnmount() {
    // Removes the event handler
    this.onTrackChange.remove()
    this.onStateChanged.remove()
  }

  handleOnPressPlay = async (event) => {
    const { playbackStatus } = this.props

    try {
      if (playbackStatus === 'playing') {
        await TrackPlayer.stop()
      }

      await TrackPlayer.play()
    } catch (_) {}

  }

  handleOnPressPause = async (event) => {
    try {
      await TrackPlayer.pause()
    } catch (_) {}
  }

  skipToNext = async () => {
    try {
      await TrackPlayer.skipToNext()
    } catch (_) {}
  }

  skipToPrevious = async () => {
    try {
      await TrackPlayer.skipToPrevious()
    } catch (_) {}
  }

  render() {
    const { trackUrl, playbackStatus } = this.props
    const { isDisabled, track } = this.state

    return (
      <AudioPlayer
        track={track}
        trackUrl={trackUrl}
        isPlaying={playbackStatus === 'playing'}
        isDisabled={isDisabled}
        handleOnPressPlay={this.handleOnPressPlay}
        handleOnPressPause={this.handleOnPressPause}
      />
    )
  }
}

const mapStateToProps = ({ player }) => {
  // let storedRepositories = articles.articles.map(repo => ({ key: repo.id, ...repo }));
  return {
    trackUrl: player.trackUrl,
    track: player.track,
    playbackStatus: player.playbackStatus
  };
};

const mapDispatchToProps = {
  setPlaybackStatus
};

export const AudioPlayerContainer = connect(mapStateToProps, mapDispatchToProps)(AudioPlayerContainerComponent);
