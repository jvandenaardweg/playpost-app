import * as ReactNativeKeychain from 'react-native-keychain';
import { APP_BUNDLE_ID } from '../../constants/bundle-id';
import * as KeychainHelper from '../keychain';

jest.mock('react-native-keychain');

describe('kechain', () => {

  describe('getKeychainArguments()', () => {
    beforeEach(() => {
      jest.resetAllMocks();
      jest.resetModules();
    })

    it('should return the correct keychainArguments when on iOS', async () => {

      // Mock like we are on Android
      jest.mock('Platform', () => {
        const Platform = require.requireActual('Platform');
        Platform.OS = 'ios';
        return Platform;
      });

      expect(KeychainHelper.getKeychainArguments()).toMatchObject({
        accessGroup: 'group.playpost',
        service: APP_BUNDLE_ID
      });

    });

    it('should return the correct keychainArguments when on Android', async () => {

      // Mock like we are on Android
      jest.mock('Platform', () => {
        const Platform = require.requireActual('Platform');
        Platform.OS = 'android';
        return Platform;
      });

      expect(KeychainHelper.getKeychainArguments()).toMatchObject({
        service: APP_BUNDLE_ID
      });

    });

  })
  describe('getToken()', () => {
    beforeEach(() => {
      jest.resetAllMocks();
      jest.resetModules();
    })

    it('should get the token from iOS keychain if it exists', async () => {

      // Mock like we are on iOS
      jest.mock('Platform', () => {
        const Platform = require.requireActual('Platform');
        Platform.OS = 'ios';
        return Platform;
      });

      const spyGetGenericPassword = jest.spyOn(ReactNativeKeychain, 'getGenericPassword').mockResolvedValueOnce({
        service: '',
        username: '',
        password: 'testtoken'
      })

      try {
        const token = await KeychainHelper.getToken();

        expect(token).toBe('testtoken');
        expect(spyGetGenericPassword).toHaveBeenCalledTimes(1)
        expect(spyGetGenericPassword).toHaveBeenCalledWith({
          accessGroup: 'group.playpost',
          service: APP_BUNDLE_ID
        })
      } catch (err) {
        expect(err.message).toBe('')
      }

    });

    it('should get the token from Android keychain if it exists', async () => {

      // Mock like we are on Android
      jest.mock('Platform', () => {
        const Platform = require.requireActual('Platform');
        Platform.OS = 'android';
        return Platform;
      });

      const spyGetGenericPassword = jest.spyOn(ReactNativeKeychain, 'getGenericPassword').mockResolvedValueOnce({
        service: '',
        username: '',
        password: 'testtoken'
      })

      const token = await KeychainHelper.getToken();

      expect(token).toBe('testtoken');
      expect(spyGetGenericPassword).toHaveBeenCalledTimes(1)
      expect(spyGetGenericPassword).toHaveBeenCalledWith({
        service: APP_BUNDLE_ID
      })
    });
  });
});
