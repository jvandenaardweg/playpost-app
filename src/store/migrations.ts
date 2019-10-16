import { userLanguageCode } from '../locale';
import { RootState } from '../reducers';
import { UserTheme, availableThemes } from '../reducers/user';

export const migrations = {
  4: (state: RootState) => ({
    ...state,
    user: {
      ...state.user,
      deviceLocale: userLanguageCode, // en, fr, nl etc...
    },
    voices: {
      ...state.voices,
      deviceLocale: undefined
    }
  }),
  5: (state: RootState) => ({
    ...state,
    user: {
      ...state.user,
      isPremium: undefined // Remove isPremium from user reducer
    },
  }),
  6: (state: RootState) => ({
    ...state,
    user: {
      ...state.user,
      playbackSpeed: 1 // Moved playbackSpeed from player reducer to user reducer
    }
  }),
  7: (state: RootState) => ({
    ...state,
    player: {
      ...state.player,
      playbackSpeed: undefined // Remove playbackSpeed from player
    }
  }),
  8: (state: RootState) => ({
    ...state,
    user: {
      ...state.user,
      isLoadingUpdateEmail: undefined, // remove
      isLoadingUpdatePassword: undefined, // remove
      isLoadingPatchUser: false // add, with default
    }
  }),
  9: (state: RootState) => ({
    ...state,
    subscriptions: {
      ...state.subscriptions,
      isActiveUpgradeModal: false
    }
  }),
  10: (state: RootState) => ({
    ...state,
    playlist: {
      ...state.playlist,
      isLoadingDeleteItem: false
    }
  }),
  11: (state: RootState) => ({
    ...state,
    subscriptions: {
      ...state.subscriptions,
      localPurchaseHistory: []
    }
  }),
  13: (state: RootState) => ({
    ...state,
    user: {
      ...state.user,
      availableThemes,
      selectedTheme: UserTheme.light
    }
  })
}
