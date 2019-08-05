import { createStore } from 'redux';
import {
  selectDownloadedVoicePreviews,
  selectLanguages,
  selectLanguagesWithActiveVoices,
  selectLanguagesWithActiveVoicesByLanguageName,
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

    expect(selectTotalAvailableVoices(exampleState)).toBe(118);
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

    expect(selectSortedLanguages(exampleState)[0].name).toBe('Dutch');
    expect(selectSortedLanguages(exampleState)[1].name).toBe('English');
    expect(selectSortedLanguages(exampleState)[2].name).toBe('French');
    expect(selectSortedLanguages(exampleState)[3].name).toBe('German');
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
});
