import { userReducer, initialState, RESET_USER_STATE, GET_USER_FAIL } from '../user';

describe('user reducer', () => {
  it('should return the initial state', () => {
    expect(userReducer(undefined, {})).toEqual(initialState);
  });

  it('should handle RESET_USER_STATE', () => {

    const expectedState = {
      ...initialState,
      error: 'An unknown error happened while getting your account. Please contact us when this happens all the time.'
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
});
