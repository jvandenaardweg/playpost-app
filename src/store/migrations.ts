import DeviceInfo from 'react-native-device-info';
import { RootState } from '../reducers';

export const migrations = {
  4: (state: RootState) => ({
    ...state,
    user: {
      ...state.user,
      deviceLocale: DeviceInfo.getDeviceLocale()
    },
    voices: {
      ...state.voices,
      deviceLocale: undefined
    }
  })
}
