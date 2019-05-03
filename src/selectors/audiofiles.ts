import { createSelector } from 'reselect';
import { RootState } from '../reducers';
import { AudiofilesState } from '../reducers/audiofiles';

const audiofilesSelector = (state: RootState): AudiofilesState => state.audiofiles;

export const getDownloadedAudiofiles = createSelector(
  [audiofilesSelector],
  audiofiles => audiofiles.downloaded
);
