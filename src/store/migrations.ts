import DeviceInfo from 'react-native-device-info';
import { RootState } from '../reducers';

export const migrations = {
  4: (state: RootState) => ({
    ...state,
    user: {
      ...state.user,
      deviceLocale: DeviceInfo.getDeviceLocale() // add with default
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
  })
}
