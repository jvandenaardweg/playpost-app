import { GET_USER_FAIL_MESSAGE } from '../../constants/messages';
import { GET_USER_FAIL, initialState, RESET_USER_ERROR, RESET_USER_STATE, userReducer } from '../user';

describe('user reducer', () => {
  it('should return the initial state', () => {
    expect(userReducer(undefined, {})).toEqual(initialState);
  });

  it('should handle RESET_USER_STATE', () => {
    const expectedState = {
      ...initialState,
      error: GET_USER_FAIL_MESSAGE
    };

    // Add something to the store, so we can test the reset
    expect(
      userReducer(undefined, {
        type: GET_USER_FAIL
      })
    ).toEqual(expectedState);

    // Test the reset
    expect(
      userReducer(expectedState, {
        type: RESET_USER_STATE
      })
    ).toEqual(initialState);
  });

  it('should handle RESET_USER_ERROR', () => {
    const expectedState = {
      ...initialState,
      error: GET_USER_FAIL_MESSAGE
    };

    // Add something to the store, so we can test the reset
    expect(
      userReducer(undefined, {
        type: GET_USER_FAIL
      })
    ).toEqual(expectedState);

    // Test the reset
    expect(
      userReducer(expectedState, {
        type: RESET_USER_ERROR
      })
    ).toEqual(initialState);
  });
});
