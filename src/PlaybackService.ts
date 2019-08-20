/**
 * This is the code that will run tied to the player.
 *
 * The code here might keep running in the background.
 *
 * You should put everything here that should be tied to the playback but not the UI
 * such as processing media buttons or analytics
 */

import * as TrackPlayer from 'react-native-track-player';

module.exports = async function PlaybackService(): Promise<void> {
  // More info: https://github.com/react-native-kit/react-native-track-player/wiki/Documentation#events

  TrackPlayer.default.addEventListener(TrackPlayer.Event.RemotePlay, () => {
    TrackPlayer.default.play();
  });

  TrackPlayer.default.addEventListener(TrackPlayer.Event.RemotePause, () => {
    TrackPlayer.default.pause();
  });

  TrackPlayer.default.addEventListener(TrackPlayer.Event.RemoteNext, () => {
    TrackPlayer.default.skipToNext();
  });

  TrackPlayer.default.addEventListener(TrackPlayer.Event.RemotePrevious, () => {
    TrackPlayer.default.skipToPrevious();
  });

  TrackPlayer.default.addEventListener(TrackPlayer.Event.RemoteStop, () => {
    TrackPlayer.default.stop();
  });

  TrackPlayer.default.addEventListener(TrackPlayer.Event.RemoteSeek, (data: { position: number }) => {
    TrackPlayer.default.seekTo(data.position);
  });

  // TrackPlayer.addEventListener('remote-duck', (data: { paused: boolean, permanent: boolean, ducking: boolean}) => {
  //   // https://react-native-kit.github.io/react-native-track-player/documentation/#remote-duck
  //   if (data.paused) TrackPlayer.pause();
  //   if (data.permanent) TrackPlayer.stop();
  //   if (data.ducking) TrackPlayer.setVolume(0.5);
  // });
};
