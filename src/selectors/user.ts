import { createSelector } from 'reselect';
import { UserState } from '../reducers/user';
import { RootState } from '../reducers';

export const userSelector = (state: RootState): UserState => state.user;

export const getUserError = createSelector(
  [userSelector],
  user => user.error
);

export const getUserIsLoading = createSelector(
  [userSelector],
  user => user.isLoading
);

export const getUserDetails = createSelector(
  [userSelector],
  user => user.details
);

export const getUserSelectedVoices = createSelector(
  [userSelector],
  (user) => {
    if (!user.details || !user.details.voiceSettings.length) {
      return [];
    }
    return user.details.voiceSettings.map(userVoiceSetting => userVoiceSetting.voice);
  }
);

export const getUserSelectedVoiceByLanguageName = (state: RootState, props: { languageName: string }) => createSelector(
  [getUserSelectedVoices],
  voices => voices.find(voice => voice.language.name === props.languageName)
)(state);
