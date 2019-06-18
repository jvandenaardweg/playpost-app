import { audiofilesSelector, selectDownloadedAudiofiles, selectIsDownloadedAudiofilesByArticleAudiofiles } from '../audiofiles';
import { createStore } from 'redux';

import { initialState } from '../../reducers/audiofiles';
import { rootReducer } from '../../reducers';

import audiofilesMock from '../../../tests/__mocks__/audiofiles';

const store = createStore(rootReducer);

const rootState = store.getState();
// const userStore = rootState.user;

describe('audiofiles selector', () => {
  it('should return the initial state', () => {
    expect(audiofilesSelector(rootState)).toEqual(initialState);
  });

  it('selectDownloadedAudiofiles should return the downloaded audiofiles', () => {
    const exampleState = {
      ...rootState,
      audiofiles: {
        ...rootState.audiofiles,
        downloaded: audiofilesMock
      }
    };

    expect(selectDownloadedAudiofiles(exampleState)).toMatchObject(audiofilesMock);
  });

  it('selectIsDownloadedAudiofilesByArticleAudiofiles should return true or false', () => {
    const exampleStateWithDownloads = {
      ...rootState,
      audiofiles: {
        ...rootState.audiofiles,
        downloaded: audiofilesMock
      }
    };

    const exampleStateWithoutDownloads = {
      ...rootState,
      audiofiles: {
        ...rootState.audiofiles,
        downloaded: []
      }
    };

    const audiofilesToCompareWith = audiofilesMock;

    expect(selectIsDownloadedAudiofilesByArticleAudiofiles(exampleStateWithDownloads, audiofilesToCompareWith)).toEqual(true);
    expect(selectIsDownloadedAudiofilesByArticleAudiofiles(exampleStateWithoutDownloads, audiofilesToCompareWith)).toEqual(false);
  });

});
