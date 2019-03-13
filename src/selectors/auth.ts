import { createSelector } from 'reselect';
import { AuthState } from '../reducers/auth';

const authSelector = (state: any): AuthState => state.auth;

export const getAuthenticationToken = createSelector(
  authSelector,
  auth => auth.token
);

export const getAuthenticationStatus = createSelector(
  getAuthenticationToken,
  (token) => {
    if (token) return 'LOGGED_IN';
    return 'LOGGED_OUT';
  }
);

export const getAuthError = createSelector(
  authSelector,
  auth => auth.error
);

