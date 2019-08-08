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
