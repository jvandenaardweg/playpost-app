import { Platform } from 'react-native';
import * as RNIap from 'react-native-iap';

/**
 * Method to finish subscription transactions for iOS and Android. Both platforms are handled correctly.
 *
 * @param purchase
 */
export const finishSubscriptionTransaction = async (purchase: RNIap.SubscriptionPurchase): Promise<void | string | RNIap.PurchaseResult> => {
  return RNIap.finishTransaction(purchase, false);
}

export const requestSubscription = async (
  newProductId: string,
  activeInAppSubscriptionProductId: Api.InAppSubscription['productId'],
  activeInAppSubscriptionService: Api.InAppSubscription['service']
): Promise<RNIap.SubscriptionPurchase> => {
  // Correctly handle upgrades from lower subscriptions on Android
  // If the active subscription is an android subscription, we want to have some control over how the upgrade/downgrade happens...
  if (Platform.OS === 'android' && activeInAppSubscriptionProductId && activeInAppSubscriptionService === 'google') {

    // https://developer.android.com/reference/com/android/billingclient/api/BillingFlowParams.ProrationMode.html
    const prorationModes = {
      UNKNOWN_SUBSCRIPTION_UPGRADE_DOWNGRADE_POLICY: 0, // Unknown
      IMMEDIATE_WITH_TIME_PRORATION: 1, // The default behavior. Replacement takes effect immediately, and the remaining time will be prorated and credited to the user.
      IMMEDIATE_AND_CHARGE_PRORATED_PRICE: 2, // Replacement takes effect immediately, and the billing cycle remains the same.
      IMMEDIATE_WITHOUT_PRORATION: 3, // Replacement takes effect immediately, and the new price will be charged on next recurrence time.
      DEFERRED: 4 // Replacement takes effect when the old plan expires, and the new price will be charged at the same time.
    }

    // IMMEDIATE_WITH_TIME_PRORATION
    // The default behavior.
    // When downgrading, the billing date is changed according to the remaining amount of the last time the user paid.
    // When upgrading, the user is charged immediately and, again, the new billing date is calculated according to the amount that was last paid.
    return RNIap.requestSubscription(newProductId, false, activeInAppSubscriptionProductId, prorationModes['IMMEDIATE_WITH_TIME_PRORATION'])

  }

  return RNIap.requestSubscription(newProductId, false)
}
