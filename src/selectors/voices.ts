import { createSelector } from 'reselect';

import { createDeepEqualSelector } from './index';

import { RootState } from '../reducers';
import { VoicesState } from '../reducers/voices';
import { selectDeviceLocale, selectUserSelectedVoiceByLanguageName, selectUserSelectedVoices, selectUserIsSubscribed, selectUserHasUsedFreeIntroduction } from './user';

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
    if (!languages.length) {
      return [];
    }

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
    if (!languages.length) {
      return 0;
    }

    return languages.reduce((prev, curr) => {
      if (!curr.voices || !curr.voices.length) { return prev; }
      const activeVoices = curr.voices && curr.voices.filter(voice => voice.isActive);

      /* tslint:disable-next-line no-parameter-reassignment */
      prev = prev + activeVoices.length;
      return prev;
    }, 0);
  }
);

export const selectTotalAvailableUnsubscribedVoices = createDeepEqualSelector(
  [selectSortedLanguages],
  languages => {
    if (!languages.length) {
      return 0;
    }

    return languages.reduce((prev, curr) => {
      if (!curr.voices || !curr.voices.length) { return prev; }
      const unsubscribedActiveVoices = curr.voices && curr.voices.filter(voice => voice.isUnsubscribedLanguageDefault && voice.isActive);

      /* tslint:disable-next-line no-parameter-reassignment */
      prev = prev + unsubscribedActiveVoices.length;
      return prev;
    }, 0);
  }
);

export const selectLanguagesWithActiveVoices = createDeepEqualSelector(
  [selectSortedLanguages, selectDeviceLocale],
  (languages, deviceLocale): Api.Language[] => {
    if (!languages.length) {
      return [];
    }

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
      const languageIndex = languagesWithActiveVoices.findIndex(language => language.code === deviceLocale);

      // Move language to first position in array
      languagesWithActiveVoices.splice(
        0, // new index,
        0, // no removal
        languagesWithActiveVoices.splice(languageIndex, 1)[0] // detach the item and return it
      );
    } else {
      // If we cannot find the user's language, then just put English on top
      const englishLanguageIndex = languagesWithActiveVoices.findIndex(language => language.code === 'en');

      // Move language to first position in array
      languagesWithActiveVoices.splice(
        0, // new index,
        0, // no removal
        languagesWithActiveVoices.splice(englishLanguageIndex, 1)[0] // detach the item and return it
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
  (languages): AvailableVoicesByLanguageName | null => {
    if (!languages.length) {
      return null;
    }

    // Convert the array to an object
    // So we can easily pick a language inside our components
    const languagesWithActiveVoicesByLanguageName: AvailableVoicesByLanguageName = languages.reduce((prev, curr) => {
      prev[curr.name] = curr;

      return prev;
    }, {})

    if (!Object.keys(languagesWithActiveVoicesByLanguageName).length) {
      return null;
    }

    return languagesWithActiveVoicesByLanguageName;
  }
);

/**
 * Returns an array with available quality options of all languages
 * So we can create a filter for it
 */
export const selectQualityOptions = createDeepEqualSelector(
  [selectLanguagesWithActiveVoices],
  languages => {
    if (!languages.length) {
      return [];
    }

    return ['All', 'Normal', 'High', 'Very High'];
  }
);

export const selectGenderOptions = createDeepEqualSelector(
  [selectLanguagesWithActiveVoices],
  languages => {
    if (!languages.length) {
      return [];
    }

    return ['All', 'Male', 'Female'];
  }
);

export const selectCountryOptions = createDeepEqualSelector(
  [selectLanguagesWithActiveVoices],
  languages => {
    if (!languages.length) {
      return [];
    }

    // Convert the array to an object
    // So we can easily pick a language inside our components
    const countryCodeOptions = languages.reduce((prev, curr) => {
      prev[curr.name] = [];

      // Extract the gender options from the voices
      const voiceCountryCodeOptions = curr.voices && curr.voices.reduce((prevVoice, currVoice) => {
        prevVoice.push(currVoice.countryCode);
        return prevVoice;
      }, [] as string[]);

      // Map through the genders of the voices and add them all
      if (voiceCountryCodeOptions && voiceCountryCodeOptions.length) {

        voiceCountryCodeOptions.map((countryCode) => {
          prev[curr.name].push(countryCode);
        })
      }

      // Finally, create a unique array and sort it
      prev[curr.name] = ['All', ...[...new Set(prev[curr.name])].sort()];

      return prev;
    }, {});

    return countryCodeOptions;
  }
);

const getLanguageByName = (state: RootState, { languageName }: { languageName: string }) => state.voices.languages.find(language => language.name === languageName);

// Uses a normal createSelector, seems more performant
export const makeSelectedVoiceForLanguageName = () => {
  return createSelector(
    [getLanguageByName, selectUserSelectedVoices, selectUserIsSubscribed, selectUserHasUsedFreeIntroduction],
    (language, userSelectedVoices, isSubscribed, userHasUsedFreeIntroduction): Api.Voice | undefined => {
      if (!language) {
        return undefined;
      }

      const defaultVoice = language.voices && language.voices.find(voice => {
        if (!isSubscribed) {
          // If the user is not subscribed, and has not used his free introduction
          // Select the default voice to be the subscribed language default
          if (!userHasUsedFreeIntroduction) {
            return !!voice.isSubscribedLanguageDefault
          }

          return !!voice.isUnsubscribedLanguageDefault
        }

        return !!voice.isSubscribedLanguageDefault
      });

      const foundUserSelectedVoice = userSelectedVoices.find(userSelectedVoice => userSelectedVoice.language.id === language.id);

      // If a user is subscribed, and the user has it's own selected voice, show that one
      // Else, default back to the default voice
      // const selectedVoice = isSubscribed ? foundUserSelectedVoice || defaultVoice : defaultVoice;
      const selectedVoice = foundUserSelectedVoice || defaultVoice;

      return selectedVoice
    }
  )
};
