import { Platform } from 'react-native';
import * as Keychain from 'react-native-keychain';
import { APP_BUNDLE_ID } from '../constants/bundle-id';

export const getKeychainArguments = () => {
  if (Platform.OS === 'android') {
    return {
      service: APP_BUNDLE_ID
    }
  }
  return {
    accessGroup: 'group.playpost', // only required for iOS
    service: APP_BUNDLE_ID
  }
}

export const getToken = async (): Promise<string | null> => {
  const keychainArguments = getKeychainArguments();
  const credentials = await Keychain.getGenericPassword(keychainArguments);
  let token = null;

  if (credentials && credentials.password && credentials.username) {
    token = credentials.password;
  }

  return token;
}

export const setToken = async (token: string): Promise<boolean> => {
  const keychainArguments = getKeychainArguments();
  return Keychain.setGenericPassword('token', token, keychainArguments);
}

export const resetToken = async (): Promise<boolean> => {
  const keychainArguments = getKeychainArguments();
  return Keychain.resetGenericPassword(keychainArguments);
}
