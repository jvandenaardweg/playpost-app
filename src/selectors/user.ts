import { createSelector } from 'reselect';
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
  voices => {
    // Convert the array to an object
    // So we can easily pick a language inside our components
    const voicesObjectWithLanguageNameKeys: UserSelectedVoiceByLanguageName = voices.reduce((prev, curr) => {
      prev[curr.language.name] = curr;

      return prev;
    }, {})

    return voicesObjectWithLanguageNameKeys;
  }
);

export const selectUserSubscriptions = createDeepEqualSelector(
  [selectUserDetails],
  userDetails => userDetails && userDetails.inAppSubscriptions
);
