import RNIap, { SubscriptionPurchase } from 'react-native-iap';
import * as utils from '../../../tests/utils/react-native';
import { SUBSCRIPTION_PRODUCT_ID_PLUS, SUBSCRIPTION_PRODUCT_ID_PREMIUM, SUBSCRIPTION_PRODUCT_ID_UNLIMITED } from '../../constants/in-app-purchase';
import * as inAppPurchaseHelper from '../in-app-purchase-helper'

jest.mock('react-native-iap');

describe('in-app-purchase-helper', () => {
  describe('finishSubscriptionTransaction', () => {
    beforeEach(() => {
      jest.resetAllMocks();
      jest.resetModules();
    })

    it('should correctly handle an error when transactionId is not found on a iOS purchase', async () => {

      // Mock like we are on iOS
      utils.mockPlatform('ios');

      try {
        await inAppPurchaseHelper.finishSubscriptionTransaction({} as any)
      } catch (err) {
        expect(err.message).toBe('Transaction ID is not found on purchase.');
      }

    });

    it('should correctly handle an error when transactionId is not found on a iOS purchase', async () => {
      // Mock like we are on Android
      utils.mockPlatform('android');

      try {
        await inAppPurchaseHelper.finishSubscriptionTransaction({} as any)
      } catch (err) {
        expect(err.message).toBe('Purchase Token is not found on purchase.');
      }

    });

    it('should correctly handle an correct iOS purchase', async () => {
      const productId = SUBSCRIPTION_PRODUCT_ID_PREMIUM;
      const transactionReceipt = '[REDACTED]';
      const transactionId = '150000534161208';
      const transactionDate = 1566204171000;
      const purchaseToken = 'sometoken';
      const mockPurchase = { productId, transactionReceipt, transactionId, transactionDate, purchaseToken }

      // Mock like we are on iOS
      utils.mockPlatform('ios');

      const spyFinishTransactionIOS = jest.spyOn(RNIap, 'finishTransaction')

      await inAppPurchaseHelper.finishSubscriptionTransaction(mockPurchase as SubscriptionPurchase);

      expect(spyFinishTransactionIOS).toHaveBeenCalledTimes(1)
      expect(spyFinishTransactionIOS).toHaveBeenCalledWith(mockPurchase, false)

    });

    it('should correctly handle an correct Android purchase', async () => {
      const productId = SUBSCRIPTION_PRODUCT_ID_PREMIUM;
      const transactionReceipt = '[REDACTED]';
      const transactionId = '150000534161208';
      const transactionDate = 1566204171000;
      const purchaseToken = 'sometoken';
      const purchaseStateAndroid = 1;
      const isAcknowledgedAndroid = undefined;
      const mockPurchase = { productId, transactionReceipt, transactionId, transactionDate, purchaseToken, purchaseStateAndroid, isAcknowledgedAndroid }

      // Mock like we are on iOS
      utils.mockPlatform('android');

      const spyAcknowledgePurchaseAndroid = jest.spyOn(RNIap, 'finishTransaction')

      await inAppPurchaseHelper.finishSubscriptionTransaction(mockPurchase as SubscriptionPurchase);

      expect(spyAcknowledgePurchaseAndroid).toHaveBeenCalledTimes(1)
      expect(spyAcknowledgePurchaseAndroid).toHaveBeenCalledWith(mockPurchase, false)

    });
  });

  describe('requestSubscription', () => {
    beforeEach(() => {
      jest.resetAllMocks();
      jest.resetModules();
    })

    it('should correctly handle an upgrade on Android from free to premium', async () => {
      utils.mockPlatform('android');

      await inAppPurchaseHelper.requestSubscription(SUBSCRIPTION_PRODUCT_ID_PREMIUM, '', '');

      const spyRequestSubscription = jest.spyOn(RNIap, 'requestSubscription')

      expect(spyRequestSubscription).toHaveBeenCalledTimes(1)
      expect(spyRequestSubscription).toHaveBeenCalledWith(SUBSCRIPTION_PRODUCT_ID_PREMIUM, false)
    })

    it('should correctly handle an upgrade on Android from free to unlimited', async () => {
      utils.mockPlatform('android');

      await inAppPurchaseHelper.requestSubscription(SUBSCRIPTION_PRODUCT_ID_UNLIMITED, '', '');

      const spyRequestSubscription = jest.spyOn(RNIap, 'requestSubscription')

      expect(spyRequestSubscription).toHaveBeenCalledTimes(1)
      expect(spyRequestSubscription).toHaveBeenCalledWith(SUBSCRIPTION_PRODUCT_ID_UNLIMITED, false)
    })

    it('should correctly handle an upgrade on Android from free to plus', async () => {
      utils.mockPlatform('android');

      await inAppPurchaseHelper.requestSubscription(SUBSCRIPTION_PRODUCT_ID_PLUS, '', '');

      const spyRequestSubscription = jest.spyOn(RNIap, 'requestSubscription')

      expect(spyRequestSubscription).toHaveBeenCalledTimes(1)
      expect(spyRequestSubscription).toHaveBeenCalledWith(SUBSCRIPTION_PRODUCT_ID_PLUS, false)
    })

    it('should correctly handle an upgrade on Android from premium to plus', async () => {
      utils.mockPlatform('android');

      await inAppPurchaseHelper.requestSubscription(SUBSCRIPTION_PRODUCT_ID_PLUS, SUBSCRIPTION_PRODUCT_ID_PREMIUM, 'google');

      const spyRequestSubscription = jest.spyOn(RNIap, 'requestSubscription')

      expect(spyRequestSubscription).toHaveBeenCalledTimes(1)
      expect(spyRequestSubscription).toHaveBeenCalledWith(SUBSCRIPTION_PRODUCT_ID_PLUS, false, SUBSCRIPTION_PRODUCT_ID_PREMIUM, 1)
    })

    it('should correctly handle an upgrade on Android from premium to unlimited', async () => {
      utils.mockPlatform('android');

      await inAppPurchaseHelper.requestSubscription(SUBSCRIPTION_PRODUCT_ID_UNLIMITED, SUBSCRIPTION_PRODUCT_ID_PREMIUM, 'google');

      const spyRequestSubscription = jest.spyOn(RNIap, 'requestSubscription')

      expect(spyRequestSubscription).toHaveBeenCalledTimes(1)
      expect(spyRequestSubscription).toHaveBeenCalledWith(SUBSCRIPTION_PRODUCT_ID_UNLIMITED, false, SUBSCRIPTION_PRODUCT_ID_PREMIUM, 1)
    })

    it('should correctly handle an downgrade on Android from unlimited to premium', async () => {
      utils.mockPlatform('android');

      await inAppPurchaseHelper.requestSubscription(SUBSCRIPTION_PRODUCT_ID_PREMIUM, SUBSCRIPTION_PRODUCT_ID_UNLIMITED, 'google');

      const spyRequestSubscription = jest.spyOn(RNIap, 'requestSubscription')

      expect(spyRequestSubscription).toHaveBeenCalledTimes(1)
      expect(spyRequestSubscription).toHaveBeenCalledWith(SUBSCRIPTION_PRODUCT_ID_PREMIUM, false, SUBSCRIPTION_PRODUCT_ID_UNLIMITED, 1)
    })

    it('should correctly handle an downgrade on Android from plus to premium', async () => {
      utils.mockPlatform('android');

      await inAppPurchaseHelper.requestSubscription(SUBSCRIPTION_PRODUCT_ID_PREMIUM, SUBSCRIPTION_PRODUCT_ID_PLUS, 'google');

      const spyRequestSubscription = jest.spyOn(RNIap, 'requestSubscription')

      expect(spyRequestSubscription).toHaveBeenCalledTimes(1)
      expect(spyRequestSubscription).toHaveBeenCalledWith(SUBSCRIPTION_PRODUCT_ID_PREMIUM, false, SUBSCRIPTION_PRODUCT_ID_PLUS, 1)
    })

    it('should correctly handle an upgrade on iOS from free to premium', async () => {
      utils.mockPlatform('ios');

      await inAppPurchaseHelper.requestSubscription(SUBSCRIPTION_PRODUCT_ID_PREMIUM, '', 'apple');

      const spyRequestSubscription = jest.spyOn(RNIap, 'requestSubscription')

      expect(spyRequestSubscription).toHaveBeenCalledTimes(1)
      expect(spyRequestSubscription).toHaveBeenCalledWith(SUBSCRIPTION_PRODUCT_ID_PREMIUM, false)
    })

    it('should correctly handle an upgrade on iOS from free to plus', async () => {
      utils.mockPlatform('ios');

      await inAppPurchaseHelper.requestSubscription(SUBSCRIPTION_PRODUCT_ID_PLUS, '', 'apple');

      const spyRequestSubscription = jest.spyOn(RNIap, 'requestSubscription')

      expect(spyRequestSubscription).toHaveBeenCalledTimes(1)
      expect(spyRequestSubscription).toHaveBeenCalledWith(SUBSCRIPTION_PRODUCT_ID_PLUS, false)
    })

    it('should correctly handle an upgrade on iOS from free to unlimited', async () => {
      utils.mockPlatform('ios');

      await inAppPurchaseHelper.requestSubscription(SUBSCRIPTION_PRODUCT_ID_UNLIMITED, '', 'apple');

      const spyRequestSubscription = jest.spyOn(RNIap, 'requestSubscription')

      expect(spyRequestSubscription).toHaveBeenCalledTimes(1)
      expect(spyRequestSubscription).toHaveBeenCalledWith(SUBSCRIPTION_PRODUCT_ID_UNLIMITED, false)
    })

    it('should correctly handle an upgrade on iOS from premium to plus', async () => {
      utils.mockPlatform('ios');

      await inAppPurchaseHelper.requestSubscription(SUBSCRIPTION_PRODUCT_ID_PLUS, '', 'apple');

      const spyRequestSubscription = jest.spyOn(RNIap, 'requestSubscription')

      expect(spyRequestSubscription).toHaveBeenCalledTimes(1)
      expect(spyRequestSubscription).toHaveBeenCalledWith(SUBSCRIPTION_PRODUCT_ID_PLUS, false)
    })
  })
});
