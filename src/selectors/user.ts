import { createSelector } from 'reselect';
import { UserState } from '../reducers/user';
import { RootState } from '../reducers';

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

export const selectUserSelectedVoices = createSelector(
  [userSelector],
  (user) => {
    if (!user.details || !user.details.voiceSettings.length) {
      return [];
    }
    return user.details.voiceSettings.map(userVoiceSetting => userVoiceSetting.voice);
  }
);

export const selectUserSelectedVoiceByLanguageName = (state: RootState, languageName?: string) => createSelector(
  [selectUserSelectedVoices],
  (voices) => {
    if (!languageName) return;
    return voices.find(voice => voice.language.name === languageName);
  }
)(state);

export const selectUserSubscriptions = createSelector(
  [selectUserDetails],
  userDetails => userDetails && userDetails.inAppSubscriptions
);
