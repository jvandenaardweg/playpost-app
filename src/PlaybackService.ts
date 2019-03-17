/**
 * This is the code that will run tied to the player.
 *
 * The code here might keep running in the background.
 *
 * You should put everything here that should be tied to the playback but not the UI
 * such as processing media buttons or analytics
 */

import TrackPlayer from 'react-native-track-player';

module.exports = async function PlaybackService() {
  // More info: https://github.com/react-native-kit/react-native-track-player/wiki/Documentation#events

  TrackPlayer.addEventListener('remote-play', () => {
    TrackPlayer.play();
  });

  TrackPlayer.addEventListener('remote-pause', () => {
    TrackPlayer.pause();
  });

  TrackPlayer.addEventListener('remote-next', () => {
    TrackPlayer.skipToNext();
  });

  TrackPlayer.addEventListener('remote-previous', () => {
    TrackPlayer.skipToPrevious();
  });

  TrackPlayer.addEventListener('remote-stop', () => {
    TrackPlayer.stop();
  });

  TrackPlayer.addEventListener('remote-seek', (position: number) => {
    TrackPlayer.seekTo(position);
  });

  // TrackPlayer.addEventListener('remote-duck', (data: { paused: boolean, permanent: boolean, ducking: boolean}) => {
  //   // https://react-native-kit.github.io/react-native-track-player/documentation/#remote-duck
  //   if (data.paused) TrackPlayer.pause();
  //   if (data.permanent) TrackPlayer.stop();
  //   if (data.ducking) TrackPlayer.setVolume(0.5);
  // });
};
