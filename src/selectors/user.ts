import { createSelector } from 'reselect';
import { SUBSCRIPTION_NAME, SUBSCRIPTION_PRODUCT_ID_FREE } from '../constants/in-app-purchase';
import { RootState } from '../reducers';
import { UserState } from '../reducers/user';
import { createDeepEqualSelector } from './index';

export interface UserSelectedVoiceByLanguageName {
  [key: string]: Api.Voice
}

export const userSelector = (state: RootState): UserState => state.user;

export const selectUserError = createSelector(
  [userSelector],
  user => user.error
);

export const selectUserErrorSaveSelectedVoice = createSelector(
  [userSelector],
  user => user.errorSaveSelectedVoice
);

export const selectUserIsLoading = createSelector(
  [userSelector],
  user => user.isLoading
);

export const selectUserDetails = createSelector(
  [userSelector],
  user => user.details
);

export const selectDeviceLocale = createSelector(
  [userSelector],
  user => {
    if (!user.deviceLocale) {
      return '';
    }

    // device locale could be: "en-NL" or "en"
    // So we always split the dash
    // Even if the dash does not exist, we return the first in the array
    const deviceLocaleSplitted = user.deviceLocale.split('-');

    if (!deviceLocaleSplitted || !deviceLocaleSplitted[0]) {
      return '';
    }

    return deviceLocaleSplitted[0];
  }
);

export const selectUserSelectedVoices = createDeepEqualSelector(
  [selectUserDetails],
  (userDetails) => {
    if (!userDetails || !userDetails.voiceSettings || !userDetails.voiceSettings.length) {
      return [];
    }
    return userDetails.voiceSettings.map(userVoiceSetting => userVoiceSetting.voice);
  }
);

export const selectUserSelectedVoiceByLanguageName = createDeepEqualSelector(
  [selectUserSelectedVoices],
  (voices): UserSelectedVoiceByLanguageName | null => {
    // Convert the array to an object
    // So we can easily pick a language inside our components
    const voicesObjectWithLanguageNameKeys: UserSelectedVoiceByLanguageName = voices.reduce((prev, curr) => {
      prev[curr.language.name] = curr;

      return prev;
    }, {})

    if (!Object.keys(voicesObjectWithLanguageNameKeys).length) {
      return null;
    }

    return voicesObjectWithLanguageNameKeys;
  }
);

export const selectUserSubscriptions = createDeepEqualSelector(
  [selectUserDetails],
  userDetails => userDetails && userDetails.inAppSubscriptions
);

export const selectUserIsSubscribed = createSelector(
  [selectUserDetails],
  (userDetails): boolean => !!(userDetails && userDetails.isSubscribed)
);

/**
 * The active subscription's productId is different per platform.
 *
 * TODO: make sure when we upgrade on Android, we do not pass in the "oldSku" from an iOS subscription
 */
export const selectUserActiveSubscriptionProductId = createSelector(
  [selectUserDetails, selectUserIsSubscribed],
  (userDetails, isSubscribed): string => {
    if (!isSubscribed) { return SUBSCRIPTION_PRODUCT_ID_FREE; }
    if (!userDetails) { return SUBSCRIPTION_PRODUCT_ID_FREE; }
    if (!userDetails.activeInAppSubscription) { return SUBSCRIPTION_PRODUCT_ID_FREE; }
    return userDetails.activeInAppSubscription.productId;
  }
);

export const selectUserActiveSubscription = createSelector(
  [selectUserDetails, selectUserIsSubscribed],
  (userDetails, isSubscribed): Api.InAppSubscription | null => {
    if (!isSubscribed) { return null; }
    if (!userDetails) { return null; }
    if (!userDetails.activeInAppSubscription) { return null; }

    return userDetails.activeInAppSubscription;
  }
);

export const selectUserActiveSubscriptionName = createSelector(
  [selectUserActiveSubscription],
  (userActiveSubscription): string => {
    if (!userActiveSubscription) {
      return SUBSCRIPTION_NAME[SUBSCRIPTION_PRODUCT_ID_FREE];
    }
    return userActiveSubscription.name
  }
);

export const selectUserHasSubscribedBefore = createDeepEqualSelector(
  [selectUserSubscriptions],
  userInAppSubscriptions => {
    if (!userInAppSubscriptions || !userInAppSubscriptions.length) {
      return false;
    }

    // If the user has a previous in app subscription record, return true
    return !!userInAppSubscriptions.length;
  }
);

export const selectUserPlaybackSpeed = createSelector(
  [userSelector],
  user =>  user.playbackSpeed
)
