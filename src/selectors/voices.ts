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

export const selectLanguages = createSelector(
  [voicesSelector],
  voices => voices.languages
);

export const selectVoicesError = createSelector(
  [voicesSelector],
  voices => voices.error
);

export const selectTotalAvailableVoices = createDeepEqualSelector(
  [selectLanguages],
  languages => {
    return languages.reduce((prev, curr) => {
      if (!curr.voices) { return prev; }
      const activeVoices = curr.voices && curr.voices.filter(voice => voice.isActive);

      /* tslint:disable-next-line no-parameter-reassignment */
      prev = prev + activeVoices.length;
      return prev;
    }, 0);
  }
);

export const selectLanguagesWithActiveVoices = createDeepEqualSelector(
  [selectLanguages, selectDeviceLocale],
  (languages, deviceLocale) => {
    // Return languages with active voices
    const languagesWithActiveVoices = languages
      .map(language => {
        return {
          ...language,
          voices: language.voices && language.voices.filter(voice => voice.isActive)
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name)); // sort languages alphabetically

    // If we have a language code, find the language code and move that language to the top
    if (deviceLocale) {
      languagesWithActiveVoices.some(language => language.code === deviceLocale && languagesWithActiveVoices.unshift(language))
    }

    return languagesWithActiveVoices;
  }
)

export const selectDownloadedVoicePreviews = createDeepEqualSelector(
  [voicesSelector],
  voices => voices.downloadedVoicePreviews
);

export const selectAvailableVoicesByLanguageName = createDeepEqualSelector(
  [selectLanguagesWithActiveVoices],
  languages => {
    // Convert the array to an object
    // So we can easily pick a language inside our components
    const languageObjectWithVoices: AvailableVoicesByLanguageName = languages.reduce((prev, curr) => {
      // Sort the voices alhabetically
      if (curr.voices && curr.voices.length) {
        const sortedVoices = [...curr.voices].sort((a, b) => {
          const aLabel = a.label ? a.label : '';
          const bLabel = b.label ? b.label : '';
          return aLabel.localeCompare(bLabel);
        });

        curr.voices = sortedVoices;
      }

      prev[curr.name] = curr;

      return prev;
    }, {})

    return languageObjectWithVoices;
  }
);
