import { createSelector } from 'reselect';
import { AuthState } from '../reducers/auth';
import { RootState } from '../reducers';

const authSelector = (state: RootState): AuthState => state.auth;

export const getAuthenticationToken = createSelector(
  [authSelector],
  auth => auth.token
);

export const getAuthError = createSelector(
  [authSelector],
  auth => auth.error
);

export const getIsLoading = createSelector(
  [authSelector],
  auth => auth.isLoading
);

export const getAuthenticationStatus = createSelector(
  [getAuthenticationToken],
  (token) => {
    if (token) return 'LOGGED_IN';
    return 'LOGGED_OUT';
  }
);
