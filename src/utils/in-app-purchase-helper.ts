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

export const requestSubscription = async (newProductId: string, activeInAppSubscriptionProductId: Api.InAppSubscription['productId'], activeInAppSubscriptionService: Api.InAppSubscription['service']) => {
  // Correctly handle upgrades from lower subscriptions on Android
  // If the active subscription is an android subscription, we want to have some control over how the upgrade/downgrade happens...
  if (Platform.OS === 'android' && activeInAppSubscriptionProductId && activeInAppSubscriptionService === 'google') {

    // https://developer.android.com/reference/com/android/billingclient/api/BillingFlowParams.ProrationMode.html
    const prorationModes = {
      'UNKNOWN_SUBSCRIPTION_UPGRADE_DOWNGRADE_POLICY': 0, // Unknown
      'IMMEDIATE_WITH_TIME_PRORATION': 1, // The default behavior. Replacement takes effect immediately, and the remaining time will be prorated and credited to the user.
      'IMMEDIATE_AND_CHARGE_PRORATED_PRICE': 2, // Replacement takes effect immediately, and the billing cycle remains the same.
      'IMMEDIATE_WITHOUT_PRORATION': 3, // Replacement takes effect immediately, and the new price will be charged on next recurrence time.
      'DEFERRED': 4 // Replacement takes effect when the old plan expires, and the new price will be charged at the same time.
    }

    // IMMEDIATE_WITH_TIME_PRORATION
    // The default behavior.
    // When downgrading, the billing date is changed according to the remaining amount of the last time the user paid.
    // When upgrading, the user is charged immediately and, again, the new billing date is calculated according to the amount that was last paid.
    return RNIap.requestSubscription(newProductId, activeInAppSubscriptionProductId, prorationModes['IMMEDIATE_WITH_TIME_PRORATION'])

  }

  return RNIap.requestSubscription(newProductId)
}
