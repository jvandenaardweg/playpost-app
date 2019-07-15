import { GET_LANGUAGES_FAIL_MESSAGE } from '../../constants/messages';
import { GET_LANGUAGES_FAIL, initialState, RESET_VOICES_ERROR, voicesReducer } from '../voices';

describe('voices reducer', () => {
  it('should return the initial state', () => {
    expect(voicesReducer(undefined, {})).toEqual(initialState);
  });

  it('should handle RESET_VOICES_ERROR', () => {
    const expectedState = {
      ...initialState,
      error: GET_LANGUAGES_FAIL_MESSAGE
    };

    // Add something to the store, so we can test the reset
    expect(
      voicesReducer(undefined, {
        type: GET_LANGUAGES_FAIL
      })
    ).toEqual(expectedState);

    // Test the reset
    expect(
      voicesReducer(expectedState, {
        type: RESET_VOICES_ERROR
      })
    ).toEqual(initialState);
  });
});
