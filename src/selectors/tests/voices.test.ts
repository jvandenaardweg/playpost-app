import { voicesSelector, selectLanguages, selectLanguagesWithActiveVoices, selectDownloadedVoicePreviews, selectAvailableVoicesByLanguageName, selectDefaultVoicesByLanguageName } from '../voices';
import { createStore } from 'redux';

import { initialState } from '../../reducers/voices';
import { rootReducer } from '../../reducers';

import languagesMock from '../../../tests/__mocks__/languages';
import voicesMock from '../../../tests/__mocks__/voices';

const store = createStore(rootReducer);

const rootState = store.getState();
// const userStore = rootState.user;

describe('voices selector', () => {
  it('should return the initial state', () => {
    expect(voicesSelector(rootState)).toEqual(initialState);
  });

  it('should return the languages', () => {
    const exampleState = {
      ...rootState,
      voices: {
        ...rootState.voices,
        languages: languagesMock
      }
    };

    expect(selectLanguages(exampleState)).toMatchObject(languagesMock);
  });

  it('should return the languages with active voices', () => {
    const exampleState = {
      ...rootState,
      voices: {
        ...rootState.voices,
        languages: languagesMock
      }
    };

    const expected = languagesMock.map((language: Api.Language) => {
      return {
        ...language,
        voices: language.voices && language.voices.filter(voice => voice.isActive)
      };
    });

    expect(selectLanguagesWithActiveVoices(exampleState)).toMatchObject(expected);
  });

  it('should return the downloaded voice preview voices', () => {
    const exampleState = {
      ...rootState,
      voices: {
        ...rootState.voices,
        downloadedVoicePreviews: voicesMock
      }
    };

    expect(selectDownloadedVoicePreviews(exampleState)).toMatchObject(voicesMock);
  });

  it('should return the available voices by language name', () => {
    const exampleState = {
      ...rootState,
      voices: {
        ...rootState.voices,
        languages: languagesMock
      }
    };

    const languageName = 'English';
    const languages = selectLanguagesWithActiveVoices(exampleState);

    const language = languages.find(language => language.name === languageName);
    const expected = language && language.voices;

    expect(selectAvailableVoicesByLanguageName(exampleState, languageName)).toEqual(expected);
    expect(selectAvailableVoicesByLanguageName(exampleState, '')).toEqual([]);
  });

  it('should return the default voice by language name', () => {
    const exampleState = {
      ...rootState,
      voices: {
        ...rootState.voices,
        languages: languagesMock
      }
    };

    const languageName = 'English';
    const languages = selectLanguagesWithActiveVoices(exampleState);

    const language = languages.find(language => language.name === languageName);
    const expected = language && language.voices && language.voices.filter(voice => !!voice.isLanguageDefault);

    expect(selectDefaultVoicesByLanguageName(exampleState, languageName)).toEqual(expected);
    expect(selectDefaultVoicesByLanguageName(exampleState, '')).toEqual(null);
  });
});
