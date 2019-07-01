import {
  playerSelector,
  selectPlayerAudiofile,
  selectPlayerPlaybackState,
  selectPlayerTrack,
  selectErrorCreateAudiofile,
  selectPlayerArticleId,
  selectPlayerAudiofileStatus
} from '../player';
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

  it('selectPlayerArticleId should return articleId of the currently playing audio', () => {
    const exampleState = {
      ...rootState,
      player: {
        ...rootState.player,
        articleId: 'e102cb67-62cd-4d56-8d0f-2e4f7f1381af'
      }
    };

    expect(selectPlayerArticleId(exampleState)).toEqual(
      'e102cb67-62cd-4d56-8d0f-2e4f7f1381af'
    );
  });

  it('selectErrorCreateAudiofile should return an error message when creating an audiofile fails', () => {
    const exampleState = {
      ...rootState,
      player: {
        ...rootState.player,
        errorCreateAudiofile: 'Test error'
      }
    };

    expect(selectErrorCreateAudiofile(exampleState)).toEqual('Test error');
  });

  it('selectPlayerAudiofileStatus should return the correct status when creating or downloading an audiofile', () => {
    const exampleState1 = {
      ...rootState,
      player: {
        ...rootState.player,
        isCreatingAudiofile: true,
        isDownloadingAudiofile: false
      }
    };

    const exampleState2 = {
      ...rootState,
      player: {
        ...rootState.player,
        isCreatingAudiofile: false,
        isDownloadingAudiofile: true
      }
    };

    const exampleState3 = {
      ...rootState,
      player: {
        ...rootState.player,
        isCreatingAudiofile: false,
        isDownloadingAudiofile: false
      }
    };

    const exampleState4 = {
      ...rootState,
      player: {
        ...rootState.player,
        isCreatingAudiofile: true,
        isDownloadingAudiofile: true
      }
    };

    expect(selectPlayerAudiofileStatus(exampleState1)).toEqual(
      'Creating article audio...'
    );
    expect(selectPlayerAudiofileStatus(exampleState2)).toEqual(
      'Downloading article audio...'
    );
    expect(selectPlayerAudiofileStatus(exampleState3)).toEqual(null);
    expect(selectPlayerAudiofileStatus(exampleState4)).toEqual(
      'Loading article audio...'
    );
  });
});
