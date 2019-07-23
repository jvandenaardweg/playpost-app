import { createStore } from 'redux';
import {
  selectAvailableVoicesByLanguageName,
  selectDefaultVoiceByLanguageName,
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

    const expected = languagesMock
      .map((language: Api.Language) => {
        return {
          ...language,
          voices: language.voices && language.voices.filter(voice => voice.isActive)
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name)); // sort languages alphabetically

    expect(selectLanguagesWithActiveVoices(exampleState)).toMatchObject(expected);
  });

  it('selectLanguagesWithActiveVoices with a userLanguageCode should return the languages with active voices with the users language on top', () => {
    const exampleState = {
      ...rootState,
      voices: {
        ...rootState.voices,
        languages: languagesMock
      }
    };

    const userLanguageCode = 'nl';

    const expected = languagesMock
      .map((language: Api.Language) => {
        return {
          ...language,
          voices: language.voices && language.voices.filter(voice => voice.isActive)
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name)); // sort languages alphabetically

    if (userLanguageCode) {
      expected.some(language => language.code === userLanguageCode && expected.unshift(language))
    }


    expect(selectLanguagesWithActiveVoices(exampleState, 'nl')).toMatchObject(expected);
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

    const languageName = 'English';
    const languages = selectLanguagesWithActiveVoices(exampleState);

    const languageByName = languages.find(language => language.name === languageName);

    const expected =
      languageByName &&
      languageByName.voices &&
      [...languageByName.voices].sort((a, b) => {
        const aLabel = a.label ? a.label : '';
        const bLabel = b.label ? b.label : '';
        return aLabel.localeCompare(bLabel);
      });

    expect(selectAvailableVoicesByLanguageName(exampleState, languageName)).toEqual(expected);
    expect(selectAvailableVoicesByLanguageName(exampleState, '')).toEqual([]);
  });

  it('selectDefaultVoiceByLanguageName should return the default voice by language name', () => {
    const exampleState = {
      ...rootState,
      voices: {
        ...rootState.voices,
        languages: languagesMock
      }
    };

    const languageName = 'English';
    const languages = selectLanguagesWithActiveVoices(exampleState);

    const languageByName = languages.find(language => language.name === languageName);
    const expected = languageByName && languageByName.voices && languageByName.voices.find(voice => !!voice.isLanguageDefault);

    expect(selectDefaultVoiceByLanguageName(exampleState, languageName)).toEqual(expected);
    expect(selectDefaultVoiceByLanguageName(exampleState, '')).toEqual(null);
  });
});
