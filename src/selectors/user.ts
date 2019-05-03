import { createSelector } from 'reselect';
import { UserState } from '../reducers/user';
import { RootState } from '../reducers';

const userSelector = (state: RootState): UserState => state.user;

export const getUserError = createSelector(
  [userSelector],
  user => user.error
);

export const getUserIsLoading = createSelector(
  [userSelector],
  user => user.isLoading
);

export const getUserDetails = createSelector(
  [userSelector],
  user => user.details
);
