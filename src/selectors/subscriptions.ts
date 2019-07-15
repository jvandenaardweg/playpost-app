import { createSelector } from 'reselect';
import { RootState } from '../reducers';
import { SubscriptionsState } from '../reducers/subscriptions';

export const subscriptionsSelector = (state: RootState): SubscriptionsState => state.subscriptions;

export const selectSubscriptions = createSelector(
  [subscriptionsSelector],
  state => state.subscriptions
);

export const selectIsLoadingSubscriptions = createSelector(
  [subscriptionsSelector],
  (state): boolean => state.isLoadingSubscriptions
);

export const selectSubscriptionsError = createSelector(
  [subscriptionsSelector],
  (state): string => state.error
);

export const selectErrorValidateSubscriptionReceipt = createSelector(
  [subscriptionsSelector],
  (state): string => state.errorValidateSubscriptionReceipt
);

export const selectSubscriptionsValidationResult = createSelector(
  [subscriptionsSelector],
  state => state.validationResult
);

export const selectSubscriptionLatestReceipt = createSelector(
  [selectSubscriptionsValidationResult],
  (validationResult): string => {
    if (!validationResult) { return ''; }

    const { latestReceipt } = validationResult;

    if (!latestReceipt) { return ''; }

    return latestReceipt;
  }
);

export const selectIsSubscribed = createSelector(
  [selectSubscriptionsValidationResult],
  (validationResult): boolean => {
    const { status } = validationResult;
    if (status !== 'active') { return false; }
    return true;
  }
);

export const selectActiveSubscriptionProductId = createSelector(
  [selectSubscriptionsValidationResult, selectIsSubscribed],
  (validationResult, isSubscribed): string => {
    if (!isSubscribed) { return 'free'; }
    if (!validationResult || !validationResult.inAppSubscription || !validationResult.inAppSubscription.productId) { return 'free'; }
    return validationResult.inAppSubscription.productId;
  }
);

export const selectActiveSubscriptionName = createSelector(
  [selectSubscriptionsValidationResult, selectIsSubscribed],
  (validationResult, isSubscribed): string => {
    if (!isSubscribed) { return 'Free'; }
    if (!validationResult || !validationResult.inAppSubscription || !validationResult.inAppSubscription.name) { return 'Free'; }
    return validationResult.inAppSubscription.name;
  }
);
