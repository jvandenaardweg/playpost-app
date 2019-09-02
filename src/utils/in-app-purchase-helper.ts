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

    // Only aknowledge when it is not acknowledged yet
    // Or else we get an error
    // From: https://github.com/dooboolab/react-native-iap/blob/ec53ac446b5ebdd459a53dde6a52b49d089ab292/IapExample/App.js#L66
    if (purchase.purchaseStateAndroid === 1 && !purchase.isAcknowledgedAndroid) {
      const acknowledgeResult = await RNIap.acknowledgePurchaseAndroid(purchase.purchaseToken);
      return acknowledgeResult;
    }

    return
  }

  if (!purchase.transactionId) {
    throw new Error('Transaction ID is not found on purchase.');
  }

  return RNIap.finishTransactionIOS(purchase.transactionId);
}
