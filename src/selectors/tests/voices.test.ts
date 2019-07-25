import { createStore } from 'redux';
import {
  selectAvailableVoicesByLanguageName,
  selectDownloadedVoicePreviews,
  selectLanguages,
  selectLanguagesWithActiveVoices,
  selectTotalAvailableVoices,
  selectVoicesError,
  voicesSelector
} from '../voices';

import { rootReducer } from '../../reducers';
import { initialState } from '../../reducers/voices';

import languagesMock from '../../../tests/__mocks__/languages';
import voicesMock from '../../../tests/__mocks__/voices';

const store = createStore(rootReducer);

const rootState = store.getState();
// const userStore = rootState.user;

describe('voices selector', () => {
  it('should return the initial state', () => {
    expect(voicesSelector(rootState)).toEqual(initialState);
  });

  it('selectLanguages should return the languages', () => {
    const exampleState = {
      ...rootState,
      voices: {
        ...rootState.voices,
        languages: languagesMock
      }
    };

    expect(selectLanguages(exampleState)).toMatchObject(languagesMock);
  });

  it('selectTotalAvailableVoices should return the languages', () => {
    const exampleState = {
      ...rootState,
      voices: {
        ...rootState.voices,
        languages: languagesMock
      }
    };

    expect(selectTotalAvailableVoices(exampleState)).toBe(43);
  });

  it('selectVoicesError should return the error', () => {
    const exampleState = {
      ...rootState,
      voices: {
        ...rootState.voices,
        error: 'Example error'
      }
    };

    expect(selectVoicesError(exampleState)).toBe('Example error');
  });

  it('selectLanguagesWithActiveVoices should return the languages with active voices', () => {
    const exampleState = {
      ...rootState,
      voices: {
        ...rootState.voices,
        languages: languagesMock
      }
    };

    expect(selectLanguagesWithActiveVoices(exampleState)).toMatchSnapshot();
  });

  it('selectDownloadedVoicePreviews should return the downloaded voice preview voices', () => {
    const exampleState = {
      ...rootState,
      voices: {
        ...rootState.voices,
        downloadedVoicePreviews: voicesMock
      }
    };

    expect(selectDownloadedVoicePreviews(exampleState)).toMatchObject(voicesMock);
  });

  it('selectAvailableVoicesByLanguageName should return the available voices by language name', () => {
    const exampleState = {
      ...rootState,
      voices: {
        ...rootState.voices,
        languages: languagesMock
      }
    };

    expect(selectAvailableVoicesByLanguageName(exampleState)).toMatchSnapshot();
  });
});
