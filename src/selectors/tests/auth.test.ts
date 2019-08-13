import { createStore } from 'redux';
import { authSelector, selectAuthError, selectErrorRequestResetPasswordToken, selectErrorUpdatePassword, selectIsLoading, selectIsLoggedIn } from '../auth';

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

  it('selectIsLoggedIn should return the true when there is a token', () => {
    const exampleState = {
      ...rootState,
      auth: {
        ...rootState.auth,
        token: 'something'
      }
    };

    expect(selectIsLoggedIn(exampleState)).toBe(true);
  });

  it('selectIsLoggedIn should return false when there is no token', () => {
    const exampleState = {
      ...rootState,
      auth: {
        ...rootState.auth,
        token: ''
      }
    };

    expect(selectIsLoggedIn(exampleState)).toBe(false);
  });
});
