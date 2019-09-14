import { createSelector } from 'reselect';
import { RootState } from '../reducers';
import { SubscriptionsState } from '../reducers/subscriptions';
import { createDeepEqualSelector } from './index';

export const subscriptionsSelector = (state: RootState): SubscriptionsState => state.subscriptions;

export const selectSubscriptions = createSelector(
  [subscriptionsSelector],
  state => state.subscriptions
);

export const selectIsLoadingSubscriptions = createSelector(
  [subscriptionsSelector],
  (state): boolean => state.isLoadingSubscriptions
);

export const selectSubscriptionsIsLoadingUpgrade = createSelector(
  [subscriptionsSelector],
  (state): boolean => state.isLoadingUpgrade
);

export const selectSubscriptionsIsLoadingRestore = createSelector(
  [subscriptionsSelector],
  (state): boolean => state.isLoadingRestore
);

export const selectSubscriptionsError = createSelector(
  [subscriptionsSelector],
  (state): string => state.error
);

export const selectErrorValidateSubscriptionReceipt = createSelector(
  [subscriptionsSelector],
  (state): string => state.errorValidateSubscriptionReceipt
);

export const selectSubscriptionsValidationResult = createDeepEqualSelector(
  [subscriptionsSelector],
  state => state.validationResult
);

export const selectIsActiveUpgradeModal = createSelector(
  [subscriptionsSelector],
  state => state.isActiveUpgradeModal
);
