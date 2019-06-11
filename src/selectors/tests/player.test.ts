import { playerSelector, selectPlayerAudiofile, selectPlayerPlaybackState, selectPlayerTrack } from '../player';
import { createStore } from 'redux';

import { initialState } from '../../reducers/player';
import { rootReducer } from '../../reducers';

import audiofileMock from '../../../tests/__mocks__/audiofile';
import trackMock from '../../../tests/__mocks__/track';

const store = createStore(rootReducer);

const rootState = store.getState();

describe('player selector', () => {
  it('playerSelector should return the initial state', () => {
    expect(playerSelector(rootState)).toEqual(initialState);
  });

  it('selectPlayerAudiofile should return the player audiofile', () => {
    const exampleState = {
      ...rootState,
      player: {
        ...rootState.player,
        audiofile: audiofileMock
      }
    };

    expect(selectPlayerAudiofile(exampleState)).toMatchObject(audiofileMock);
  });

  it('selectPlayerPlaybackState should return the player playback state', () => {
    const exampleState = {
      ...rootState,
      player: {
        ...rootState.player,
        playbackState: 'playing'
      }
    };

    expect(selectPlayerPlaybackState(exampleState)).toBe('playing');
  });

  it('selectPlayerTrack should return the player track', () => {
    const exampleState = {
      ...rootState,
      player: {
        ...rootState.player,
        track: trackMock
      }
    };

    expect(selectPlayerTrack(exampleState)).toEqual(trackMock);
  });
});
