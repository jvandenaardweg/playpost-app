import RNIap, { SubscriptionPurchase } from 'react-native-iap';
import { SUBSCRIPTION_PRODUCT_ID_PLUS, SUBSCRIPTION_PRODUCT_ID_PREMIUM } from '../../constants/in-app-purchase';
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
      jest.mock('Platform', () => {
        const Platform = require.requireActual('Platform');
        Platform.OS = 'ios';
        return Platform;
      });

      try {
        await inAppPurchaseHelper.finishSubscriptionTransaction({} as any)
      } catch (err) {
        expect(err.message).toBe('Transaction ID is not found on purchase.');
      }

    });

    it('should correctly handle an error when transactionId is not found on a iOS purchase', async () => {
      // Mock like we are on Android
      jest.mock('Platform', () => {
        const Platform = require.requireActual('Platform');
        Platform.OS = 'android';
        return Platform;
      });

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
      jest.mock('Platform', () => {
        const Platform = require.requireActual('Platform');
        Platform.OS = 'ios';
        return Platform;
      });

      const spyFinishTransactionIOS = jest.spyOn(RNIap, 'finishTransactionIOS')

      await inAppPurchaseHelper.finishSubscriptionTransaction(mockPurchase as SubscriptionPurchase);

      expect(spyFinishTransactionIOS).toHaveBeenCalledTimes(1)
      expect(spyFinishTransactionIOS).toHaveBeenCalledWith(transactionId)

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
      jest.mock('Platform', () => {
        const Platform = require.requireActual('Platform');
        Platform.OS = 'android';
        return Platform;
      });

      const spyAcknowledgePurchaseAndroid = jest.spyOn(RNIap, 'acknowledgePurchaseAndroid')

      await inAppPurchaseHelper.finishSubscriptionTransaction(mockPurchase as SubscriptionPurchase);

      expect(spyAcknowledgePurchaseAndroid).toHaveBeenCalledTimes(1)
      expect(spyAcknowledgePurchaseAndroid).toHaveBeenCalledWith(purchaseToken)

    });
  });

  describe('requestSubscription', () => {
    beforeEach(() => {
      jest.resetAllMocks();
      jest.resetModules();
    })

    it('should correctly handle an upgrade on Android from free to premium', async () => {
      jest.mock('Platform', () => {
        const Platform = require.requireActual('Platform');
        Platform.OS = 'android';
        return Platform;
      });

      await inAppPurchaseHelper.requestSubscription(SUBSCRIPTION_PRODUCT_ID_PREMIUM, '');

      const spyRequestSubscription = jest.spyOn(RNIap, 'requestSubscription')

      expect(spyRequestSubscription).toHaveBeenCalledTimes(1)
      expect(spyRequestSubscription).toHaveBeenCalledWith(SUBSCRIPTION_PRODUCT_ID_PREMIUM)
    })

    it('should correctly handle an upgrade on Android from premium to plus', async () => {
      jest.mock('Platform', () => {
        const Platform = require.requireActual('Platform');
        Platform.OS = 'android';
        return Platform;
      });

      await inAppPurchaseHelper.requestSubscription(SUBSCRIPTION_PRODUCT_ID_PLUS, SUBSCRIPTION_PRODUCT_ID_PREMIUM);

      const spyRequestSubscription = jest.spyOn(RNIap, 'requestSubscription')

      expect(spyRequestSubscription).toHaveBeenCalledTimes(1)
      expect(spyRequestSubscription).toHaveBeenCalledWith(SUBSCRIPTION_PRODUCT_ID_PLUS, SUBSCRIPTION_PRODUCT_ID_PREMIUM, 1)
    })

    it('should correctly handle an downgrade on Android from plus to premium', async () => {
      jest.mock('Platform', () => {
        const Platform = require.requireActual('Platform');
        Platform.OS = 'android';
        return Platform;
      });

      await inAppPurchaseHelper.requestSubscription(SUBSCRIPTION_PRODUCT_ID_PREMIUM, SUBSCRIPTION_PRODUCT_ID_PLUS);

      const spyRequestSubscription = jest.spyOn(RNIap, 'requestSubscription')

      expect(spyRequestSubscription).toHaveBeenCalledTimes(1)
      expect(spyRequestSubscription).toHaveBeenCalledWith(SUBSCRIPTION_PRODUCT_ID_PREMIUM, SUBSCRIPTION_PRODUCT_ID_PLUS, 1)
    })

    it('should correctly handle an upgrade on iOS from free to premium', async () => {
      jest.mock('Platform', () => {
        const Platform = require.requireActual('Platform');
        Platform.OS = 'ios';
        return Platform;
      });

      await inAppPurchaseHelper.requestSubscription(SUBSCRIPTION_PRODUCT_ID_PREMIUM, 'free');

      const spyRequestSubscription = jest.spyOn(RNIap, 'requestSubscription')

      expect(spyRequestSubscription).toHaveBeenCalledTimes(1)
      expect(spyRequestSubscription).toHaveBeenCalledWith(SUBSCRIPTION_PRODUCT_ID_PREMIUM)
    })

    it('should correctly handle an upgrade on iOS from premium to plus', async () => {
      jest.mock('Platform', () => {
        const Platform = require.requireActual('Platform');
        Platform.OS = 'ios';
        return Platform;
      });

      await inAppPurchaseHelper.requestSubscription(SUBSCRIPTION_PRODUCT_ID_PLUS, SUBSCRIPTION_PRODUCT_ID_PREMIUM);

      const spyRequestSubscription = jest.spyOn(RNIap, 'requestSubscription')

      expect(spyRequestSubscription).toHaveBeenCalledTimes(1)
      expect(spyRequestSubscription).toHaveBeenCalledWith(SUBSCRIPTION_PRODUCT_ID_PLUS)
    })
  })
});
