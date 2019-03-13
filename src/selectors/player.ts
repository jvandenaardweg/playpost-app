import { createSelector } from 'reselect';
import { PlayerState } from '../reducers/player';

import TrackPlayer from 'react-native-track-player';

const playerSelector = (state: any): PlayerState => state.player;

export const getPlayerTrack = createSelector(
  playerSelector,
  player => player.track
);

export const getPlayerPlaybackState = createSelector(
  playerSelector,
  player => player.playbackState
);

export const isLoading = createSelector(
  getPlayerPlaybackState,
  (playbackState) => {
    return playbackState && playbackState === TrackPlayer.STATE_BUFFERING;
  }
);

export const isPlaying = createSelector(
  getPlayerPlaybackState,
  (playbackState) => {
    return playbackState && playbackState === TrackPlayer.STATE_PLAYING;
  }
);

export const isStopped = createSelector(
  getPlayerPlaybackState,
  (playbackState) => {
    return playbackState && playbackState === TrackPlayer.STATE_STOPPED;
  }
);

export const isPaused = createSelector(
  getPlayerPlaybackState,
  (playbackState) => {
    return playbackState && playbackState === TrackPlayer.STATE_PAUSED;
  }
);

export const isIdle = createSelector(
  getPlayerPlaybackState,
  (playbackState) => {
    return playbackState && playbackState === TrackPlayer.STATE_NONE;
  }
);

export const isReady = createSelector(
  getPlayerPlaybackState,
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
