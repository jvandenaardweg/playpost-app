import { authSelector, getAuthError, getIsLoading, getAuthenticationStatus } from '../auth';
import { createStore } from 'redux';

import { initialState } from '../../reducers/auth';
import { rootReducer } from '../../reducers';

const store = createStore(rootReducer);

const rootState = store.getState();

describe('auth selector', () => {
  it('should return the initial state', () => {
    expect(authSelector(rootState)).toEqual(initialState);
  });

  it('should return the auth error', () => {
    const exampleState = {
      ...rootState,
      auth: {
        ...rootState.auth,
        error: 'Test error'
      }
    };

    expect(getAuthError(exampleState)).toBe('Test error');
  });

  it('should return the auth loading state', () => {
    const exampleState = {
      ...rootState,
      auth: {
        ...rootState.auth,
        isLoading: true
      }
    };

    expect(getIsLoading(exampleState)).toBe(true);
  });

  it('should return the authentication status', () => {
    const exampleState = {
      ...rootState,
      auth: {
        ...rootState.auth,
        token: 'something'
      }
    };

    expect(getAuthenticationStatus(exampleState)).toBe('LOGGED_IN');
  });
});
