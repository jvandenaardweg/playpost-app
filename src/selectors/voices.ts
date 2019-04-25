import { createSelector } from 'reselect';
import { RootState } from '../reducers';
import { VoicesState } from '../reducers/voices';

const voicesSelector = (state: RootState): VoicesState => state.voices;

export const getVoices = createSelector(
  [voicesSelector],
  voices => voices.voices
);

export const getSelectedVoiceId = createSelector(
  [voicesSelector],
  voices => voices.selectedVoiceId
);

export const getAvailableVoices = createSelector(
  [getVoices],
  voices => voices.filter(voice => voice.isActive)
);

export const getAvailableFreeVoices = createSelector(
  [getAvailableVoices],
  voices => voices.filter(voice => !voice.isPremium)
);

export const getAvailablePremiumVoices = createSelector(
  [getAvailableVoices],
  voices => voices.filter(voice => voice.isPremium)
);

export const getDefaultFreeVoice = createSelector(
  [getAvailableFreeVoices],
  voices => voices.find(voice => voice.name === 'Joanna' && voice.synthesizer === 'AWS')
);

export const getDefaultPremiumVoice = createSelector(
  [getAvailablePremiumVoices],
  voices => voices.find(voice => voice.name === 'en-US-Wavenet-D' && voice.synthesizer === 'Google')
);

export const getSelectedVoice = createSelector(
  [getSelectedVoiceId, getAvailableVoices],
  (selectedVoiceId, availableVoices) => {
    return availableVoices.find(voice => voice.id === selectedVoiceId);
  }
);
