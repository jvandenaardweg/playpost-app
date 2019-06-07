import { createSelector } from 'reselect';
import { UserState } from '../reducers/user';
import { RootState } from '../reducers';

export const userSelector = (state: RootState): UserState => state.user;

export const selectUserError = createSelector(
  [userSelector],
  user => user.error
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

export const selectUserSelectedVoiceByLanguageName = (state: RootState, props: { languageName: string }) => createSelector(
  [selectUserSelectedVoices],
  voices => voices.find(voice => voice.language.name === props.languageName)
)(state);

export const selectUserSubscriptions = createSelector(
  [selectUserDetails],
  userDetails => userDetails && userDetails.subscriptions
);
