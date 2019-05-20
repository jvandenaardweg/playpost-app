import { audiofilesSelector, getDownloadedAudiofiles } from '../audiofiles';
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

  it('should return the downloaded audiofiles', () => {
    const exampleState = {
      ...rootState,
      audiofiles: {
        ...rootState.audiofiles,
        downloaded: audiofilesMock
      }
    };

    expect(getDownloadedAudiofiles(exampleState)).toMatchObject(audiofilesMock);
  });

});
