import { createSelector } from 'reselect';

import { PlayerState } from '../reducers/player';
import { RootState } from '../reducers';

export const playerSelector = (state: RootState): PlayerState => state.player;

export const getPlayerTrack = createSelector(
  [playerSelector],
  player => player.track
);

export const getPlayerAudiofile = createSelector(
  [playerSelector],
  player => player.audiofile
);

export const getPlayerPlaybackState = createSelector(
  [playerSelector],
  player => player.playbackState
);
