import { authSelector, selectAuthError, selectIsLoading, selectAuthenticationStatus, selectErrorResetPassword } from '../auth';
import { createStore } from 'redux';

import { initialState } from '../../reducers/auth';
import { rootReducer } from '../../reducers';

const store = createStore(rootReducer);

const rootState = store.getState();

describe('auth selector', () => {
  it('should return the initial state', () => {
    expect(authSelector(rootState)).toEqual(initialState);
  });

  it('selectAuthError should return the auth error', () => {
    const exampleState = {
      ...rootState,
      auth: {
        ...rootState.auth,
        error: 'Test error'
      }
    };

    expect(selectAuthError(exampleState)).toBe('Test error');
  });

  it('selectErrorResetPassword should return the reset password error', () => {
    const exampleState = {
      ...rootState,
      auth: {
        ...rootState.auth,
        errorResetPassword: 'Test reset password error'
      }
    };

    expect(selectErrorResetPassword(exampleState)).toBe('Test reset password error');
  });

  it('selectIsLoading should return the auth loading state', () => {
    const exampleState = {
      ...rootState,
      auth: {
        ...rootState.auth,
        isLoading: true
      }
    };

    expect(selectIsLoading(exampleState)).toBe(true);
  });

  it('selectAuthenticationStatus should return the authentication status', () => {
    const exampleState = {
      ...rootState,
      auth: {
        ...rootState.auth,
        token: 'something'
      }
    };

    expect(selectAuthenticationStatus(exampleState)).toBe('LOGGED_IN');
  });
});
