import { createSelector } from 'reselect';
import { RootState } from '../reducers';
import { AudiofilesState } from '../reducers/audiofiles';

export const audiofilesSelector = (state: RootState): AudiofilesState => state.audiofiles;

export const selectDownloadedAudiofiles = createSelector(
  [audiofilesSelector],
  audiofiles => audiofiles.downloaded
);

/**
 * Selector to find out if an audiofile is downloaded based on an array of audiofiles.
 *
 * @param state
 * @param compareAudiofiles
 */
export const selectIsDownloadedAudiofilesByArticleAudiofiles = (state: RootState, compareAudiofiles?: Api.Audiofile[]) => createSelector(
  [selectDownloadedAudiofiles],
  (downloadedAudiofiles) => {
    if (!compareAudiofiles || !compareAudiofiles.length) return false;

    const articleAudiofilesIds = compareAudiofiles.map(audiofile => audiofile.id);

    return !!downloadedAudiofiles.find(audiofile => articleAudiofilesIds.includes(audiofile.id));
  }
)(state);
