import { createSelector } from 'reselect';
import { createDeepEqualSelector } from './index';

import { RootState } from '../reducers';
import { VoicesState } from '../reducers/voices';
import { selectDeviceLocale } from './user';

export interface VoicesLanguages {
  languageName: string;
  countryCode: string;
}

export interface AvailableVoicesByLanguageName {
  [key: string]: Api.Language
}

export const voicesSelector = (state: RootState): VoicesState => state.voices;

export const selectLanguages = createDeepEqualSelector(
  [voicesSelector],
  voices => voices.languages
);

export const selectVoicesError = createSelector(
  [voicesSelector],
  voices => voices.error
);

export const selectSortedLanguages = createDeepEqualSelector(
  [selectLanguages],
  languages => {
    // First, sort the voices
    const languagesWithSortedVoices = languages.map((language) => {
      const sortedVoices = language.voices && [...language.voices].sort((a, b) => {
        const aLabel = a.label ? a.label : '';
        const bLabel = b.label ? b.label : '';
        return aLabel.localeCompare(bLabel);
      })

      return {
        ...language,
        voices: sortedVoices
      }
    })

    // Then, sort the languages
    const sortedLanguages = languagesWithSortedVoices && [...languagesWithSortedVoices].sort((a, b) => a.name.localeCompare(b.name))

    return sortedLanguages;
  }
);

export const selectTotalAvailableVoices = createDeepEqualSelector(
  [selectSortedLanguages],
  languages => {
    return languages.reduce((prev, curr) => {
      if (!curr.voices || !curr.voices.length) { return prev; }
      const activeVoices = curr.voices && curr.voices.filter(voice => voice.isActive);

      /* tslint:disable-next-line no-parameter-reassignment */
      prev = prev + activeVoices.length;
      return prev;
    }, 0);
  }
);

export const selectLanguagesWithActiveVoices = createDeepEqualSelector(
  [selectSortedLanguages, selectDeviceLocale],
  (languages, deviceLocale) => {
    // Return languages with active voices
    const languagesWithActiveVoices = languages
      .map(language => {
        const voices = language.voices && language.voices;

        return {
          ...language,
          voices: voices && voices.filter(voice => voice.isActive)
        };
      })

    // If we have a language code, find the language code and move that language to the top
    if (deviceLocale) {
      const languageIndex = languagesWithActiveVoices.findIndex(language =>  language.code === deviceLocale);

      // Move language to first position in array
      languagesWithActiveVoices.splice(
        0, // new index,
        0, // no removal
        languagesWithActiveVoices.splice(languageIndex, 1)[0] // detach the item and return it
      );
    }

    return languagesWithActiveVoices;
  }
)

export const selectDownloadedVoicePreviews = createDeepEqualSelector(
  [voicesSelector],
  voices => voices.downloadedVoicePreviews
);

export const selectLanguagesWithActiveVoicesByLanguageName = createDeepEqualSelector(
  [selectLanguagesWithActiveVoices],
  languages => {
    // Convert the array to an object
    // So we can easily pick a language inside our components
    const languagesWithActiveVoicesByLanguageName: AvailableVoicesByLanguageName = languages.reduce((prev, curr) => {
      prev[curr.name] = curr;

      return prev;
    }, {})

    return languagesWithActiveVoicesByLanguageName;
  }
);
