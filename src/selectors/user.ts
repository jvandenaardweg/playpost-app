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

export const selectUserIsPremium = createSelector(
  [userSelector],
  user => user.isPremium
);

export const selectDeviceLocale = createSelector(
  [userSelector],
  user => user.deviceLocale
);

export const selectUserSelectedVoices = createDeepEqualSelector(
  [userSelector],
  (user) => {
    if (!user.details || !user.details.voiceSettings.length) {
      return [];
    }
    return user.details.voiceSettings.map(userVoiceSetting => userVoiceSetting.voice);
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
