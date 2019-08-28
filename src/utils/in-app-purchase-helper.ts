import { Platform } from 'react-native';
import RNIap from 'react-native-iap';

/**
 * Method to finish subscription transactions for iOS and Android. Both platforms are handled correctly.
 *
 * If Android, it will call "RNIap.acknowledgePurchaseAndroid".
 * If iOS, it will call "RNIap.finishTransactionIOS".
 *
 * @param purchase
 */
export const finishSubscriptionTransaction = async (purchase: RNIap.ProductPurchase): Promise<void | RNIap.PurchaseResult> => {
  if (Platform.OS === 'android') {
    if (!purchase.purchaseToken) {
      throw new Error('Purchase Token is not found on purchase.')
    }

    return RNIap.acknowledgePurchaseAndroid(purchase.purchaseToken);
  }

  if (!purchase.transactionId) {
    throw new Error('Transaction ID is not found on purchase.');
  }

  return RNIap.finishTransactionIOS(purchase.transactionId);
}
