import { Platform } from 'react-native';
import { createSelector } from 'reselect';
import { RootState } from '../reducers';
import { SubscriptionsState } from '../reducers/subscriptions';
import { createDeepEqualSelector } from './index';

export const subscriptionsSelector = (state: RootState): SubscriptionsState => state.subscriptions;

export const selectInAppSubscriptions = createSelector(
  [subscriptionsSelector],
  (state): Api.InAppSubscription[] => {
    let inAppSubscriptions = state.subscriptions

    if (!inAppSubscriptions) {
      return [];
    }

    if (Platform.OS === 'android') {
      inAppSubscriptions = inAppSubscriptions.filter((inAppSubscription) => inAppSubscription.service === 'google' || inAppSubscription.service === 'internal');
    }

    if (Platform.OS === 'ios') {
      inAppSubscriptions = inAppSubscriptions.filter((inAppSubscription) => inAppSubscription.service === 'apple' || inAppSubscription.service === 'internal');
    }

    return inAppSubscriptions;
  }
);

export const selectAvailableInAppSubscriptions = createSelector(
  [selectInAppSubscriptions],
  (inAppSubscriptions): Api.InAppSubscription[] => {
    return inAppSubscriptions.filter(inAppSubscription => inAppSubscription.isActive);
  }
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
