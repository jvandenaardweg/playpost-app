import { userSelector, getUserError, getUserIsLoading, getUserDetails, getUserSelectedVoices, getUserSelectedVoiceByLanguageName } from '../user';
import { createStore } from 'redux';

import { initialState } from '../../reducers/user';
import { rootReducer } from '../../reducers';

import exampleUser from '../../../tests/__mocks__/user';

const store = createStore(rootReducer);

const rootState = store.getState();
// const userStore = rootState.user;

describe('user selector', () => {
  it('should return the initial state', () => {
    expect(userSelector(rootState)).toEqual(initialState);
  });

  it('should return the user error', () => {
    const exampleErrorState = {
      ...rootState,
      user: {
        ...rootState.user,
        error: 'Test error'
      }
    };

    expect(getUserError(exampleErrorState)).toBe('Test error');
  });

  it('should return the loading status', () => {
    const exampleLoadingState = {
      ...rootState,
      user: {
        ...rootState.user,
        isLoading: true
      }
    };

    expect(getUserIsLoading(exampleLoadingState)).toBe(true);
  });

  it('should return the user details', () => {

    const exampleUserDetailsState = {
      ...rootState,
      user: {
        ...rootState.user,
        details: exampleUser
      }
    };

    expect(getUserDetails(exampleUserDetailsState)).toMatchObject(exampleUser);
  });

  it('should return the user\'s selected voices', () => {
    const exampleUserDetailsState = {
      ...rootState,
      user: {
        ...rootState.user,
        details: exampleUser
      }
    };

    const expected = exampleUser.voiceSettings.map(userVoiceSetting => userVoiceSetting.voice);

    expect(getUserSelectedVoices(exampleUserDetailsState)).toEqual(expected);
  });

  it('should return the user\'s selected voices by language name', () => {
    const exampleUserDetailsState = {
      ...rootState,
      user: {
        ...rootState.user,
        details: exampleUser
      }
    };

    const languageName = 'English';

    const voices = getUserSelectedVoices(exampleUserDetailsState);

    const expected = voices.find(voice => voice.language.name === languageName);

    expect(getUserSelectedVoiceByLanguageName(exampleUserDetailsState, { languageName })).toEqual(expected);
  });
});
