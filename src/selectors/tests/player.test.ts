import { playerSelector, getPlayerAudiofile, getPlayerPlaybackState } from '../player';
import { createStore } from 'redux';

import { initialState } from '../../reducers/player';
import { rootReducer } from '../../reducers';

import audiofileMock from '../../../tests/__mocks__/audiofile';

const store = createStore(rootReducer);

const rootState = store.getState();

describe('player selector', () => {
  it('should return the initial state', () => {
    expect(playerSelector(rootState)).toEqual(initialState);
  });

  it('should return the player audiofile', () => {
    const exampleState = {
      ...rootState,
      player: {
        ...rootState.player,
        audiofile: audiofileMock
      }
    };

    expect(getPlayerAudiofile(exampleState)).toMatchObject(audiofileMock);
  });

  it('should return the player playback state', () => {
    const exampleState = {
      ...rootState,
      player: {
        ...rootState.player,
        playbackState: 'playing'
      }
    };

    expect(getPlayerPlaybackState(exampleState)).toBe('playing');
  });
});
