import { audiofilesReducer, initialState, RESET_STATE, SET_DOWNLOADED_AUDIOFILE } from '../audiofiles';

import audiofileMock from '../../../tests/__mocks__/audiofile';

describe('audiofiles reducer', () => {
  it('should return the initial state', () => {
    expect(audiofilesReducer(undefined, {})).toEqual(initialState);
  });

  it('should handle RESET_STATE', () => {
    const expectedState = {
      ...initialState,
      error: 'An unknown error happened.'
    };

    // Test the reset
    expect(
      audiofilesReducer(expectedState, {
        type: RESET_STATE
      })
    ).toEqual(initialState);
  });

  it('should handle SET_DOWNLOADED_AUDIOFILE', () => {
    const expectedState = {
      ...initialState,
      downloaded: [
        audiofileMock
      ]
    };

    expect(
      audiofilesReducer(initialState, {
        type: SET_DOWNLOADED_AUDIOFILE,
        payload: audiofileMock
      })
    ).toEqual(expectedState);
  });
});
