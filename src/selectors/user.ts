import { createSelector } from 'reselect';
import { UserState } from '../reducers/user';

const userSelector = (state: any): UserState => state.user;

export const getUserError = createSelector(
  [userSelector],
  user => user.error
);

export const getUserIsLoading = createSelector(
  [userSelector],
  user => user.isLoading
);

export const getUserUser = createSelector(
  [userSelector],
  user => user.user
);
