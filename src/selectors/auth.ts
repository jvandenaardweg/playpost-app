import { createSelector } from 'reselect';
import { RootState } from '../reducers';
import { AuthState } from '../reducers/auth';

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

export const selectErrorRequestResetPasswordToken = createSelector(
  [authSelector],
  auth => auth.errorRequestResetPasswordToken
);

export const selectErrorUpdatePassword = createSelector(
  [authSelector],
  auth => auth.errorUpdatePassword
);

export const selectIsLoggedIn = createSelector(
  [selectAuthenticationToken],
  (token): boolean => !!token
);
