import { createSelector } from 'reselect';
import { RootState } from '../reducers';
import { AudiofilesState } from '../reducers/audiofiles';

export const audiofilesSelector = (state: RootState): AudiofilesState => state.audiofiles;

export const selectDownloadedAudiofiles = createSelector(
  [audiofilesSelector],
  audiofiles => audiofiles.downloaded
);
