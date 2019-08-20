import { createStore } from 'redux';
import { audiofilesSelector, selectDownloadedAudiofiles } from '../audiofiles';

import { rootReducer } from '../../reducers';
import { initialState } from '../../reducers/audiofiles';

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

});
