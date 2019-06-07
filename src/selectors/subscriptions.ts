import { createSelector } from 'reselect';
import { SubscriptionsState } from '../reducers/subscriptions';
import { RootState } from '../reducers';

export const subscriptionsSelector = (state: RootState): SubscriptionsState => state.subscriptions;

export const selectSubscriptions = createSelector(
  [subscriptionsSelector],
  state => state.subscriptions
);

export const selectIsLoadingSubscriptions = createSelector(
  [subscriptionsSelector],
  state => state.isLoadingSubscriptions
);

export const selectSubscriptionsError = createSelector(
  [subscriptionsSelector],
  state => state.error
);

export const selectSubscriptionsValidationResult = createSelector(
  [subscriptionsSelector],
  state => state.validationResult
);
