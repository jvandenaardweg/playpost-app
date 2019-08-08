import TrackPlayer from 'react-native-track-player';
import { createSelector } from 'reselect';

import { RootState } from '../reducers';
import { PlayerState } from '../reducers/player';

export const playerSelector = (state: RootState): PlayerState => state.player;

export const selectPlayerTrack = createSelector(
  [playerSelector],
  player => player.track
);

export const selectPlayerCurrentArticleId = createSelector(
  [playerSelector],
  player => player.currentArticleId
);

export const selectPlayerPreviousArticleId = createSelector(
  [playerSelector],
  player => player.previousArticleId
);

export const selectErrorCreateAudiofile = createSelector(
  [playerSelector],
  player => player.errorCreateAudiofile
);

export const selectPlayerAudiofile = createSelector(
  [playerSelector],
  player => player.audiofile
);

export const selectPlayerAudiofileStatus = createSelector(
  [playerSelector],
  player => {
    const { isCreatingAudiofile, isDownloadingAudiofile } = player;

    if (isCreatingAudiofile && isDownloadingAudiofile) {
      return 'Loading article audio...';
    }

    if (isCreatingAudiofile) { return 'Creating article audio...'; }

    if (isDownloadingAudiofile) { return 'Downloading article audio...'; }

    return null;
  }
);

export const selectPlayerPlaybackState = createSelector(
  [playerSelector],
  player =>  player.playbackState
);

export const selectPlayerIsPlaying = createSelector(
  [selectPlayerPlaybackState],
  playbackState => [TrackPlayer.STATE_PLAYING].includes(playbackState)
);

export const selectPlayerIsStopped = createSelector(
  [selectPlayerPlaybackState],
  playbackState => [TrackPlayer.STATE_STOPPED, TrackPlayer.STATE_PAUSED, TrackPlayer.STATE_NONE, TrackPlayer.STATE_READY].includes(playbackState)
);

export const selectPlayerIsLoading = createSelector(
  [selectPlayerIsPlaying, selectPlayerIsStopped],
  (playerIsPlaying, playerIsStopped) => !playerIsPlaying && !playerIsStopped
);
