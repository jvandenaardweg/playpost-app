import { createSelector } from 'reselect';
import { RootState } from '../reducers';
import { VoicesState } from '../reducers/voices';

const voicesSelector = (state: RootState): VoicesState => state.voices;

export const getVoices = createSelector(
  [voicesSelector],
  voices => voices.voices
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
  voices => voices.find(voice => voice.name === 'en-US-Standard-D')
);

export const getDefaultPremiumVoice = createSelector(
  [getAvailablePremiumVoices],
  voices => voices.find(voice => voice.name === 'en-US-Wavenet-D')
);
