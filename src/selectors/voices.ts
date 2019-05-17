import { createSelector } from 'reselect';
import { RootState } from '../reducers';
import { VoicesState } from '../reducers/voices';

export type VoicesLanguages = {
  languageName: string;
  countryCode: string;
};

const voicesSelector = (state: RootState): VoicesState => state.voices;

export const getLanguages = createSelector(
  [voicesSelector],
  voices => voices.languages
);

export const getLanguagesWithActiveVoices = createSelector(
  [getLanguages],
  (languages) => {
    // Return languages with active voices
    const languagesWithActiveVoices = languages.map((language) => {
      return {
        ...language,
        voices: language.voices.filter(voice => voice.isActive)
      };
    });

    return languagesWithActiveVoices;
  }
);

export const getIsLoadingLanguages = createSelector(
  [voicesSelector],
  voices => voices.isLoadingLanguages
);

export const getDownloadedVoicePreviews = createSelector(
  [voicesSelector],
  voices => voices.downloadedVoicePreviews
);

export const getAvailableVoicesByLanguageName = (state: RootState, props: { languageName: string }) => createSelector(
  [getLanguagesWithActiveVoices],
  (languages) => {
    const language = languages.find(language => language.name === props.languageName);
    if (!language) return [];

    return language.voices;
  }
)(state);

export const getDefaultVoicesByLanguageName = (state: RootState, props: { languageName: string }) => createSelector(
  [getLanguagesWithActiveVoices],
  (languages) => {
    const language = languages.find(language => language.name === props.languageName);
    if (!language) return null;

    const defaultVoice = language.voices.filter(voice => !!voice.isLanguageDefault);

    return defaultVoice;
  }
)(state);
