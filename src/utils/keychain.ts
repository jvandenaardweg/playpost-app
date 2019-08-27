import { Platform } from 'react-native';
import * as Keychain from 'react-native-keychain';
import { APP_BUNDLE_ID } from '../constants/bundle-id';

const keychainArguments = Platform.select({
  ios: {
    accessGroup: 'group.playpost', // only required for iOS
    service: APP_BUNDLE_ID
  },
  android: {
    service: APP_BUNDLE_ID
  }
});

export const getToken = async (): Promise<string | null> => {
  const credentials = await Keychain.getGenericPassword(keychainArguments);
  let token = null;

  if (credentials && credentials.password) {
    token = credentials.password;
  }

  return token;
}

export const setToken = async (token: string): Promise<boolean> => {
  return Keychain.setGenericPassword('token', token, keychainArguments);
}

export const resetToken = async (): Promise<boolean> => {
  return Keychain.resetGenericPassword(keychainArguments);
}
