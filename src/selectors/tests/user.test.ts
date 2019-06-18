import { userSelector, selectUserError, selectUserIsLoading, selectUserDetails, selectUserSelectedVoices, selectUserSelectedVoiceByLanguageName, selectUserSubscriptions, selectUserIsPremium, selectUserErrorSaveSelectedVoice } from '../user';
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

    expect(selectUserError(exampleErrorState)).toBe('Test error');
  });

  it('selectUserErrorSaveSelectedVoice should return the user error', () => {
    const exampleErrorState = {
      ...rootState,
      user: {
        ...rootState.user,
        errorSaveSelectedVoice: 'Test error 2'
      }
    };

    expect(selectUserErrorSaveSelectedVoice(exampleErrorState)).toBe('Test error 2');
  });

  it('should return the loading status', () => {
    const exampleLoadingState = {
      ...rootState,
      user: {
        ...rootState.user,
        isLoading: true
      }
    };

    expect(selectUserIsLoading(exampleLoadingState)).toBe(true);
  });

  it('should return the user details', () => {

    const exampleUserDetailsState = {
      ...rootState,
      user: {
        ...rootState.user,
        details: exampleUser
      }
    };

    expect(selectUserDetails(exampleUserDetailsState)).toMatchObject(exampleUser);
  });

  it('should return the premium status', () => {
    const exampleLoadingState = {
      ...rootState,
      user: {
        ...rootState.user,
        isPremium: true
      }
    };

    expect(selectUserIsPremium(exampleLoadingState)).toBe(true);
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

    expect(selectUserSelectedVoices(exampleUserDetailsState)).toEqual(expected);

    const exampleUserDetailsState2 = {
      ...rootState,
      user: {
        ...rootState.user
      }
    };
    expect(selectUserSelectedVoices(exampleUserDetailsState2)).toEqual([]);
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

    const voices = selectUserSelectedVoices(exampleUserDetailsState);

    const expected = voices.find(voice => voice.language.name === languageName);

    expect(selectUserSelectedVoiceByLanguageName(exampleUserDetailsState, languageName)).toEqual(expected);
  });

  it('should return the user\'s subscriptions', () => {
    const exampleUserState = {
      ...rootState,
      user: {
        ...rootState.user,
        details: exampleUser
      }
    };

    // TODO: add example data when we have some in the local API
    /* tslint:disable-next-line no-any */
    const expected: any[] = [];

    expect(selectUserSubscriptions(exampleUserState)).toEqual(expected);
  });
});
