import { Platform } from 'react-native';
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

export const selectUserUsedInAppSubscriptionTrials = createSelector(
  [selectUserDetails],
  userDetails => userDetails && userDetails.usedInAppSubscriptionTrials
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

export const selectUserIsSubscribed = createDeepEqualSelector(
  [selectUserDetails],
  (userDetails): boolean => !!(userDetails && userDetails.activeUserInAppSubscription)
);

/**
 * The active subscription's productId is different per platform.
 *
 */
export const selectUserActiveSubscriptionProductId = createDeepEqualSelector(
  [selectUserDetails, selectUserIsSubscribed],
  (userDetails, isSubscribed): string => {
    if (!isSubscribed) { return SUBSCRIPTION_PRODUCT_ID_FREE; }
    if (!userDetails) { return SUBSCRIPTION_PRODUCT_ID_FREE; }
    if (!userDetails.activeUserInAppSubscription) { return SUBSCRIPTION_PRODUCT_ID_FREE; }
    if (!userDetails.activeUserInAppSubscription.inAppSubscription) { return SUBSCRIPTION_PRODUCT_ID_FREE; }
    return userDetails.activeUserInAppSubscription.inAppSubscription.productId
  }
);

export const selectActiveUserInAppSubscription = createDeepEqualSelector(
  [selectUserDetails, selectUserIsSubscribed],
  (userDetails, isSubscribed): Api.UserInAppSubscriptionApple | Api.UserInAppSubscriptionGoogle | null => {
    if (!isSubscribed) { return null; }
    if (!userDetails) { return null; }
    if (!userDetails.activeUserInAppSubscription) { return null; }

    return userDetails.activeUserInAppSubscription;
  }
);

export const selectUserActiveSubscriptionName = createDeepEqualSelector(
  [selectActiveUserInAppSubscription],
  (userActiveSubscription): string => {
    if (!userActiveSubscription) {
      return SUBSCRIPTION_NAME[SUBSCRIPTION_PRODUCT_ID_FREE];
    }
    return userActiveSubscription.inAppSubscription.name
  }
);

export const selectUserIsEligibleForTrial = createDeepEqualSelector(
  [selectUserUsedInAppSubscriptionTrials],
  (usedInAppSubscriptionTrials): boolean => {
    if (!usedInAppSubscriptionTrials || !usedInAppSubscriptionTrials.length) {
      return true;
    }

    // If the platform is Android, look up if the user had a Google subscription trial before
    if (Platform.OS === 'android') {
      return !!!usedInAppSubscriptionTrials.find(usedInAppSubscription => usedInAppSubscription.service === 'google')
    }

    // If the platform is else (iOS), look up if the user had a Apple subscription trial before
    return !!!usedInAppSubscriptionTrials.find(usedInAppSubscription => usedInAppSubscription.service === 'apple')
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
