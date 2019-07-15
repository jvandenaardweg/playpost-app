import { createSelector } from 'reselect';
import { RootState } from '../reducers';
import { VoicesState } from '../reducers/voices';

export interface VoicesLanguages {
  languageName: string;
  countryCode: string;
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

export const selectTotalAvailableVoices = createSelector(
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

export const selectLanguagesWithActiveVoices = createSelector(
  [selectLanguages],
  languages => {
    // Return languages with active voices
    const languagesWithActiveVoices = languages
      .map(language => {
        return {
          ...language,
          voices: language.voices && language.voices.filter(voice => voice.isActive)
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name)); // sort languages alphabetically

    return languagesWithActiveVoices;
  }
);

export const selectDownloadedVoicePreviews = createSelector(
  [voicesSelector],
  voices => voices.downloadedVoicePreviews
);

export const selectAvailableVoicesByLanguageName = (state: RootState, languageName: string) =>
  createSelector(
    [selectLanguagesWithActiveVoices],
    languages => {
      const languageByName = languages.find(language => language.name === languageName);
      if (!languageByName) { return []; }
      if (!languageByName.voices) { return []; }

      // Sort by label name
      // Create a copy of the array by using the spread syntax
      const sortedVoices = [...languageByName.voices].sort((a, b) => {
        const aLabel = a.label ? a.label : '';
        const bLabel = b.label ? b.label : '';
        return aLabel.localeCompare(bLabel);
      });

      return sortedVoices;
    }
  )(state);

export const selectDefaultVoiceByLanguageName = (state: RootState, languageName: string) =>
  createSelector(
    [selectLanguagesWithActiveVoices],
    languages => {
      const languageByName = languages.find(language => language.name === languageName);

      if (!languageByName) { return null; }

      const defaultVoice = languageByName.voices && languageByName.voices.find(voice => !!voice.isLanguageDefault);

      return defaultVoice;
    }
  )(state);
