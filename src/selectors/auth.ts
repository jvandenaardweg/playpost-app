import { createSelector } from 'reselect';
import { AuthState } from '../reducers/auth';
import { RootState } from '../reducers';

export const authSelector = (state: RootState): AuthState => state.auth;

export const selectAuthenticationToken = createSelector(
  [authSelector],
  auth => auth.token
);

export const selectAuthError = createSelector(
  [authSelector],
  auth => auth.error
);

export const selectIsLoading = createSelector(
  [authSelector],
  auth => auth.isLoading
);

export const selectErrorResetPassword = createSelector(
  [authSelector],
  auth => auth.errorResetPassword
);

export const selectAuthenticationStatus = createSelector(
  [selectAuthenticationToken],
  (token) => {
    if (token) return 'LOGGED_IN';
    return 'LOGGED_OUT';
  }
);
