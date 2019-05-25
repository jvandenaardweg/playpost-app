import { createSelector } from 'reselect';
import { SubscriptionsState } from '../reducers/subscriptions';
import { RootState } from '../reducers';

export const subscriptionsSelector = (state: RootState): SubscriptionsState => state.subscriptions;

export const getSubscriptions = createSelector(
  [subscriptionsSelector],
  state => state.subscriptions
);

export const getIsLoadingSubscriptions = createSelector(
  [subscriptionsSelector],
  state => state.isLoadingSubscriptions
);
