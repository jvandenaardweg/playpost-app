import { createStore } from 'redux';
import { authSelector, selectAuthenticationStatus, selectAuthError, selectErrorRequestResetPasswordToken, selectErrorUpdatePassword, selectIsLoading } from '../auth';

import { rootReducer } from '../../reducers';
import { initialState } from '../../reducers/auth';

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

  it('selectErrorRequestResetPasswordToken should return the reset password error', () => {
    const exampleState = {
      ...rootState,
      auth: {
        ...rootState.auth,
        errorRequestResetPasswordToken: 'Test reset password error'
      }
    };

    expect(selectErrorRequestResetPasswordToken(exampleState)).toBe('Test reset password error');
  });

  it('selectErrorUpdatePassword should return the reset password error', () => {
    const exampleState = {
      ...rootState,
      auth: {
        ...rootState.auth,
        errorUpdatePassword: 'Test update password error'
      }
    };

    expect(selectErrorUpdatePassword(exampleState)).toBe('Test update password error');
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
