import { createSelector } from 'reselect';
import { SubscriptionsState } from '../reducers/subscriptions';
import { RootState } from '../reducers';

export const subscriptionsSelector = (state: RootState): SubscriptionsState => state.subscriptions;

export const selectSubscriptions = createSelector(
  [subscriptionsSelector],
  state => state.subscriptions
);

export const selectSubscriptionByProductId = (state: RootState, props: { productId: string }) => createSelector(
  [selectSubscriptions],
  subscriptions => subscriptions.find(subscription => subscription.productId === props.productId)
)(state);

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

export const selectSubscriptionLatestReceipt = createSelector(
  [selectSubscriptionsValidationResult],
  (validationResult) => {
    const { latestReceipt } = validationResult;
    if (!latestReceipt) return null;
    return latestReceipt;
  }
);

export const selectIsSubscribed = createSelector(
  [selectSubscriptionsValidationResult],
  (validationResult) => {
    const { status } = validationResult;
    if (status !== 'active') return false;
    return true;
  }
);
