import { createStore } from 'redux';
import {
  makeSelectedVoiceForLanguageName,
  selectCountryOptions,
  selectDownloadedVoicePreviews,
  selectGenderOptions,
  selectLanguageByName,
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
import voiceEnGbMock from '../../../tests/__mocks__/voice-en-gb';
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

  it('selectLanguagesWithActiveVoices should return the languages with the user his deviceLocale language on top', () => {
    const exampleState = {
      ...rootState,
      user: {
        ...rootState.user,
        deviceLocale: 'nl'
      },
      voices: {
        ...rootState.voices,
        languages: languagesMock
      }
    };

    expect(selectLanguagesWithActiveVoices(exampleState)[0].code).toBe('nl');
  });

  it('selectLanguagesWithActiveVoices should return the languages with English on top if deviceLocale returns nothing', () => {
    const exampleState = {
      ...rootState,
      user: {
        ...rootState.user,
        deviceLocale: ''
      },
      voices: {
        ...rootState.voices,
        languages: languagesMock
      }
    };

    expect(selectLanguagesWithActiveVoices(exampleState)[0].code).toBe('en');
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

    expect(selectLanguagesWithActiveVoicesByLanguageName(exampleState)).toBe(null);
  });

  it('selectSortedLanguages should return the languages sorted by name', () => {
    const exampleState = {
      ...rootState,
      voices: {
        ...rootState.voices,
        languages: languagesMock
      }
    };

    expect(selectSortedLanguages(exampleState)[0].name).toBe('Arabic');
    expect(selectSortedLanguages(exampleState)[1].name).toBe('Chinese');
    expect(selectSortedLanguages(exampleState)[2].name).toBe('Czech');
    expect(selectSortedLanguages(exampleState)[3].name).toBe('Danish');
    expect(selectSortedLanguages(exampleState)[4].name).toBe('Dutch');
    expect(selectSortedLanguages(exampleState)[5].name).toBe('English');
    expect(selectSortedLanguages(exampleState)[6].name).toBe('Finnish');
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

  it('selectLanguageByName should return the language based on the given language name', () => {
    const exampleState = {
      ...rootState,
      voices: {
        ...rootState.voices,
        languages: languagesMock
      }
    };

    const expectedEnglish = languagesMock.filter(language => language.name === 'English');
    const expectedGerman = languagesMock.filter(language => language.name === 'German');

    expect(selectLanguageByName(exampleState, { languageName: 'English' })).toMatchObject(expectedEnglish[0]);
    expect(selectLanguageByName(exampleState, { languageName: 'German' })).toMatchObject(expectedGerman[0]);
  });

  it('makeSelectedVoiceForLanguageName should return the default English voice when not subscribed', () => {
    const exampleState = {
      ...rootState,
      voices: {
        ...rootState.voices,
        languages: languagesMock
      }
    };

    // Mock user selectors
    const user = require('../user')

    user.selectUserIsSubscribed = jest.fn().mockReturnValue(false)
    user.selectUserSelectedVoices = jest.fn().mockReturnValue([])
    user.selectUserHasUsedFreeIntroduction = jest.fn().mockReturnValue(true)

    const selectSelectedVoiceForLanguageName = makeSelectedVoiceForLanguageName();

    const voice = selectSelectedVoiceForLanguageName(exampleState, { languageName: 'English' })

    expect(voice && voice.label).toBe('Joanna');

  });

  it('makeSelectedVoiceForLanguageName should return the default English voice when subscribed', () => {
    const exampleState = {
      ...rootState,
      voices: {
        ...rootState.voices,
        languages: languagesMock
      }
    };

    // Mock user selectors
    const user = require('../user')

    user.selectUserIsSubscribed = jest.fn().mockReturnValue(true)
    user.selectUserSelectedVoices = jest.fn().mockReturnValue([])
    user.selectUserHasUsedFreeIntroduction = jest.fn().mockReturnValue(true)

    const selectSelectedVoiceForLanguageName = makeSelectedVoiceForLanguageName();

    const voice = selectSelectedVoiceForLanguageName(exampleState, { languageName: 'English' })

    expect(voice && voice.label).toBe('Emily');

  });

  it('makeSelectedVoiceForLanguageName should return the default English subscribed voice when user has free introduction left', () => {
    const exampleState = {
      ...rootState,
      voices: {
        ...rootState.voices,
        languages: languagesMock
      }
    };

    // Mock user selectors
    const user = require('../user')

    user.selectUserIsSubscribed = jest.fn().mockReturnValue(true)
    user.selectUserSelectedVoices = jest.fn().mockReturnValue([])
    user.selectUserHasUsedFreeIntroduction = jest.fn().mockReturnValue(false)

    const selectSelectedVoiceForLanguageName = makeSelectedVoiceForLanguageName();

    const voice = selectSelectedVoiceForLanguageName(exampleState, { languageName: 'English' })

    expect(voice && voice.label).toBe('Emily');

  });

  it('makeSelectedVoiceForLanguageName should return the user his selected voice when subscribed if the user has a selected voice for English', () => {
    const exampleState = {
      ...rootState,
      voices: {
        ...rootState.voices,
        languages: languagesMock
      }
    };

    // Mock user selectors
    const user = require('../user')
    user.selectUserIsSubscribed = jest.fn().mockReturnValue(true)
    user.selectUserSelectedVoices = jest.fn().mockReturnValue([voiceEnGbMock])
    user.selectUserHasUsedFreeIntroduction = jest.fn().mockReturnValue(false)

    const selectSelectedVoiceForLanguageName = makeSelectedVoiceForLanguageName();

    const voice = selectSelectedVoiceForLanguageName(exampleState, { languageName: 'English' })

    expect(voice && voice.label).toBe(voiceEnGbMock.label);

  });
});
