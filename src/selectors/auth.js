import { createSelector } from 'reselect';

const authSelector = state => state.auth;

export const getAuthenticationToken = createSelector(
  authSelector,
  auth => auth.token
);

export const getAuthenticationStatus = createSelector(
  getAuthenticationToken,
  token => {
    if (token) return 'LOGGED_IN';
    return 'LOGGED_OUT';
  }
);
