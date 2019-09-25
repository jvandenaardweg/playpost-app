import * as ReactNativeKeychain from 'react-native-keychain';
import * as utils from '../../../tests/utils/react-native';
import { APP_BUNDLE_ID } from '../../constants/bundle-id';
import * as KeychainHelper from '../keychain';

describe('kechain', () => {

  describe('getKeychainArguments()', () => {
    beforeEach(() => {
      jest.resetAllMocks();
      jest.resetModules();
    })

    it('should return the correct keychainArguments when on iOS', async () => {

      // Mock like we are on Android
      utils.mockPlatform('ios');

      expect(KeychainHelper.getKeychainArguments()).toMatchObject({
        accessGroup: 'group.playpost',
        service: APP_BUNDLE_ID
      });

    });

    it('should return the correct keychainArguments when on Android', async () => {

      // Mock like we are on Android
      utils.mockPlatform('android');

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
      utils.mockPlatform('ios');

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
      utils.mockPlatform('android');

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
