import { authReducer, initialState, RESET_AUTH_STATE, RESET_AUTH_ERROR, SET_AUTH_TOKEN, POST_AUTH, POST_AUTH_SUCCESS, SET_AUTH_ERROR, POST_AUTH_FAIL } from '../auth';

import { POST_AUTH_FAIL_MESSAGE, GENERIC_NETWORK_ERROR } from '../../constants/messages';

describe('auth reducer', () => {
  it('should return the initial state', () => {
    expect(authReducer(undefined, {})).toEqual(initialState);
  });

  it('should handle RESET_AUTH_STATE', () => {
    const exampleState = {
      ...initialState,
      error: 'An unknown error happened.'
    };

    expect(
      authReducer(exampleState, {
        type: RESET_AUTH_STATE
      })
    ).toEqual(initialState);
  });

  it('should handle RESET_AUTH_ERROR', () => {
    const exampleState = {
      ...initialState,
      error: 'An unknown error happened.'
    };

    expect(
      authReducer(exampleState, {
        type: RESET_AUTH_ERROR
      })
    ).toEqual(initialState);
  });

  it('should handle SET_AUTH_TOKEN', () => {
    const expectedState = {
      ...initialState,
      token: 'ATestToken'
    };

    expect(
      authReducer(initialState, {
        type: SET_AUTH_TOKEN,
        payload: {
          token: 'ATestToken'
        }
      })
    ).toEqual(expectedState);
  });

  it('should handle POST_AUTH', () => {
    const expectedState = {
      ...initialState,
      isLoading: true,
      error: ''
    };

    expect(
      authReducer(initialState, {
        type: POST_AUTH
      })
    ).toEqual(expectedState);
  });

  it('should handle POST_AUTH_SUCCESS', () => {
    const expectedState = {
      ...initialState,
      isLoading: false,
      token: 'ATestToken',
      error: ''
    };

    expect(
      authReducer(initialState, {
        type: POST_AUTH_SUCCESS,
        payload: {
          data: {
            token: 'ATestToken'
          }
        }
      })
    ).toEqual(expectedState);
  });

  it('should handle SET_AUTH_ERROR', () => {
    const expectedState = {
      ...initialState,
      error: 'Test error'
    };

    expect(
      authReducer(initialState, {
        type: SET_AUTH_ERROR,
        errorMessage: 'Test error'
      })
    ).toEqual(expectedState);
  });

  it('should handle POST_AUTH_FAIL', () => {
    const expectedState = {
      ...initialState,
      error: POST_AUTH_FAIL_MESSAGE
    };

    expect(
      authReducer(initialState, {
        type: POST_AUTH_FAIL,
        error: {
          status: 400
        }
      })
    ).toEqual(expectedState);
  });

  it('should handle POST_AUTH_FAIL with a generic network error', () => {
    const expectedState = {
      ...initialState,
      error: GENERIC_NETWORK_ERROR
    };

    expect(
      authReducer(initialState, {
        type: POST_AUTH_FAIL,
        error: {
          status: 0
        }
      })
    ).toEqual(expectedState);
  });

  it('should handle POST_AUTH_FAIL with a API error message', () => {
    const expectedState = {
      ...initialState,
      error: 'API Error message'
    };

    expect(
      authReducer(initialState, {
        type: POST_AUTH_FAIL,
        error: {
          status: 400,
          response: {
            data: {
              message: 'API Error message'
            }
          }
        }
      })
    ).toEqual(expectedState);
  });
});
