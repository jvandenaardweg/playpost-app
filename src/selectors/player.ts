import { createSelector } from 'reselect';
import { PlayerState } from '../reducers/player';

import TrackPlayer from 'react-native-track-player';

const playerSelector = (state: any): PlayerState => state.player;

export const getPlaybackState = createSelector(
  playerSelector,
  player => player.playbackState
);

export const isLoading = createSelector(
  getPlaybackState,
  (playbackState) => {
    return playbackState && playbackState === TrackPlayer.STATE_BUFFERING;
  }
);

export const isPlaying = createSelector(
  getPlaybackState,
  (playbackState) => {
    return playbackState && playbackState === TrackPlayer.STATE_PLAYING;
  }
);

export const isStopped = createSelector(
  getPlaybackState,
  (playbackState) => {
    return playbackState && playbackState === TrackPlayer.STATE_STOPPED;
  }
);

export const isPaused = createSelector(
  getPlaybackState,
  (playbackState) => {
    return playbackState && playbackState === TrackPlayer.STATE_PAUSED;
  }
);

export const isIdle = createSelector(
  getPlaybackState,
  (playbackState) => {
    return playbackState && playbackState === TrackPlayer.STATE_NONE;
  }
);

export const isReady = createSelector(
  getPlaybackState,
  (playbackState) => {
    return playbackState && playbackState === 'ready';
  }
);

export const isNotPlaying = createSelector(
  isReady, isIdle, isPaused, isStopped,
  (isReady, isIdle, isPaused, isStopped) => {
    return isReady || isIdle || isPaused || isStopped;
  }
);
