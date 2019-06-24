import { createSelector } from 'reselect';

import { PlayerState } from '../reducers/player';
import { RootState } from '../reducers';

export const playerSelector = (state: RootState): PlayerState => state.player;

export const selectPlayerTrack = createSelector(
  [playerSelector],
  player => player.track
);

export const selectPlayerArticleId = createSelector(
  [playerSelector],
  player => player.articleId
);

export const selectErrorCreateAudiofile = createSelector(
  [playerSelector],
  player => player.errorCreateAudiofile
);

export const selectPlayerAudiofile = createSelector(
  [playerSelector],
  player => player.audiofile
);

export const selectPlayerPlaybackState = createSelector(
  [playerSelector],
  player => player.playbackState
);
