/**
 * This is the code that will run tied to the player.
 *
 * The code here might keep running in the background.
 *
 * You should put everything here that should be tied to the playback but not the UI
 * such as processing media buttons or analytics
 */

import reactNativeTrackPlayer from 'react-native-track-player';

module.exports = async function PlaybackService() {
  // More info: https://github.com/react-native-kit/react-native-track-player/wiki/Documentation#events

  reactNativeTrackPlayer.addEventListener('remote-play', () => {
    reactNativeTrackPlayer.play();
  });

  reactNativeTrackPlayer.addEventListener('remote-pause', () => {
    reactNativeTrackPlayer.pause();
  });

  reactNativeTrackPlayer.addEventListener('remote-next', () => {
    reactNativeTrackPlayer.skipToNext();
  });

  reactNativeTrackPlayer.addEventListener('remote-previous', () => {
    reactNativeTrackPlayer.skipToPrevious();
  });

  reactNativeTrackPlayer.addEventListener('remote-stop', () => {
    reactNativeTrackPlayer.destroy();
  });
};
