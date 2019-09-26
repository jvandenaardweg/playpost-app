// TODO: move to a advanced selector

/**
 * Method to determine which language to show as selected for the current user.
 *
 * @param language
 * @param userHasUsedFreeIntroduction 
 * @param isSubscribed 
 * @param userSelectedVoices 
 */
export const getSelectedVoiceForLanguage = (
  language: Api.Language | null,
  userHasUsedFreeIntroduction: boolean | null,
  isSubscribed: boolean,
  userSelectedVoices: Api.Voice[]
): Api.Voice | undefined => {
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
  const selectedVoice = isSubscribed ? foundUserSelectedVoice || defaultVoice : defaultVoice;

  return selectedVoice
}
