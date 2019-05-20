import * as RNIap from 'react-native-iap';

export const RESET_SUBSCRIPTIONS_STATE = 'subscriptions/RESET_SUBSCRIPTIONS_STATE';

export type SubscriptionsState = Readonly<{
  isLoading: boolean;
  subscriptions: RNIap.Subscription<string>[];
  transactionReceipt: RNIap.ProductPurchase;
  error: string;
}>;

export const initialState: SubscriptionsState = {
  isLoading: false,
  subscriptions: [] as RNIap.Subscription<string>[],
  transactionReceipt: {} as RNIap.ProductPurchase,
  error: ''
};

/* tslint:disable-next-line no-any */
export function subscriptionsReducer(state = initialState, action: any): SubscriptionsState {
  switch (action.type) {
    case RESET_SUBSCRIPTIONS_STATE:
      return {
        ...initialState
      };

    default:
      return state;
  }
}

export const resetSubscriptionsState = () => ({
  type: RESET_SUBSCRIPTIONS_STATE
});
