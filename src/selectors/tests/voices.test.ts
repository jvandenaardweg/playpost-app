import { createStore } from 'redux';
import {
  selectCountryOptions,
  selectDownloadedVoicePreviews,
  selectGenderOptions,
  selectLanguages,
  selectLanguagesWithActiveVoices,
  selectLanguagesWithActiveVoicesByLanguageName,
  selectQualityOptions,
  selectSortedLanguages,
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

  it('selectTotalAvailableVoices should return the available languages total', () => {
    const exampleState = {
      ...rootState,
      voices: {
        ...rootState.voices,
        languages: languagesMock
      }
    };

    expect(typeof selectTotalAvailableVoices(exampleState)).toBe('number');
    expect(selectTotalAvailableVoices(exampleState)).toBeGreaterThan(10); // Simple check to see if we got some voices
  });

  it('selectTotalAvailableVoices should return the available languages total when a language has no voices', () => {
    const languagesMockWithoutVoices = languagesMock.map(language => {
      return {
        ...language,
        voices: []
      }
    });

    const exampleState = {
      ...rootState,
      voices: {
        ...rootState.voices,
        languages: languagesMockWithoutVoices
      }
    };

    expect(selectTotalAvailableVoices(exampleState)).toBe(0);
  });

  it('selectTotalAvailableVoices should return 0 when there are no languages', () => {
    const exampleState = {
      ...rootState,
      voices: {
        ...rootState.voices,
        languages: []
      }
    };

    expect(selectTotalAvailableVoices(exampleState)).toBe(0);
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

  it('selectLanguagesWithActiveVoices should return an empty array when there are no active voices', () => {
    const exampleState = {
      ...rootState,
      voices: {
        ...rootState.voices,
        languages: []
      }
    };

    expect(selectLanguagesWithActiveVoices(exampleState)).toHaveLength(0);
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

  it('selectLanguagesWithActiveVoicesByLanguageName should return the available voices by language name', () => {
    const exampleState = {
      ...rootState,
      voices: {
        ...rootState.voices,
        languages: languagesMock
      }
    };

    expect(selectLanguagesWithActiveVoicesByLanguageName(exampleState)).toMatchSnapshot();
  });

  it('selectLanguagesWithActiveVoicesByLanguageName should return an empty object when there are none', () => {
    const exampleState = {
      ...rootState,
      voices: {
        ...rootState.voices,
        languages: []
      }
    };

    expect(selectLanguagesWithActiveVoicesByLanguageName(exampleState)).toMatchObject({});
  });

  it('selectSortedLanguages should return the languages sorted by name', () => {
    const exampleState = {
      ...rootState,
      voices: {
        ...rootState.voices,
        languages: languagesMock
      }
    };

    expect(selectSortedLanguages(exampleState)[0].name).toBe('Chinese');
    expect(selectSortedLanguages(exampleState)[1].name).toBe('Czech');
    expect(selectSortedLanguages(exampleState)[2].name).toBe('Danish');
    expect(selectSortedLanguages(exampleState)[3].name).toBe('Dutch');
    expect(selectSortedLanguages(exampleState)[4].name).toBe('English');
    expect(selectSortedLanguages(exampleState)[5].name).toBe('Finnish');
  });

  it('selectSortedLanguages should return an empty array when there are not languages', () => {
    const exampleState = {
      ...rootState,
      voices: {
        ...rootState.voices,
        languages: []
      }
    };

    expect(selectSortedLanguages(exampleState)).toHaveLength(0);
  });

  it('selectQualityOptions should return an array with voice quality filter options', () => {
    const exampleState = {
      ...rootState,
      voices: {
        ...rootState.voices,
        languages: languagesMock
      }
    };

    const expected = ['All', 'Normal', 'High', 'Very High'];

    expect(selectQualityOptions(exampleState)).toMatchObject(expected);
  });

  it('selectGenderOptions should return an array with voice gender filter options', () => {
    const exampleState = {
      ...rootState,
      voices: {
        ...rootState.voices,
        languages: languagesMock
      }
    };

    const expected = ['All', 'Male', 'Female'];

    expect(selectGenderOptions(exampleState)).toMatchObject(expected);
  });

  it('selectCountryOptions should return an array with voice languageCode filter options', () => {
    const exampleState = {
      ...rootState,
      voices: {
        ...rootState.voices,
        languages: languagesMock
      }
    };

    const expected = {
      Dutch: ['All', 'NL'],
      English: ['All', 'AU', 'GB', 'IN', 'US'],
      French: ['All', 'CA', 'FR'],
      German: ['All', 'DE'],
      Hindi: ['All', 'IN'],
      Polish: ['All', 'PL'],
      Portuguese: ['All', 'BR', 'PT'],
      Russian: ['All', 'RU'],
      Spanish: ['All', 'ES', 'MX']
    }

    expect(selectCountryOptions(exampleState)).toMatchObject(expected);
  });
});
