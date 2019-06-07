import Analytics from 'appcenter-analytics';
import { GENERIC_NETWORK_ERROR, GET_ACTIVE_SUBSCRIPTIONS_FAIL_MESSAGE, POST_VALIDATE_SUBSCRIPTION_RECEIPT_FAIL_MESSAGE } from '../constants/messages';

export const RESET_SUBSCRIPTIONS_STATE = 'subscriptions/RESET_SUBSCRIPTIONS_STATE';

export const GET_ACTIVE_SUBSCRIPTIONS = 'subscriptions/GET_ACTIVE_SUBSCRIPTIONS';
export const GET_ACTIVE_SUBSCRIPTIONS_SUCCESS = 'subscriptions/GET_ACTIVE_SUBSCRIPTIONS_SUCCESS';
export const GET_ACTIVE_SUBSCRIPTIONS_FAIL = 'subscriptions/GET_ACTIVE_SUBSCRIPTIONS_FAIL';

export const POST_VALIDATE_SUBSCRIPTION_RECEIPT = 'subscriptions/POST_VALIDATE_SUBSCRIPTION_RECEIPT';
export const POST_VALIDATE_SUBSCRIPTION_RECEIPT_SUCCESS = 'subscriptions/POST_VALIDATE_SUBSCRIPTION_RECEIPT_SUCCESS';
export const POST_VALIDATE_SUBSCRIPTION_RECEIPT_FAIL = 'subscriptions/POST_VALIDATE_SUBSCRIPTION_RECEIPT_FAIL';

export type SubscriptionsState = Readonly<{
  isLoadingSubscriptions: boolean;
  isLoadingValidateSubscriptionReceipt: boolean;
  subscriptions: Api.Subscription[];
  validationResult: Api.ReceiptValidationResponse;
  error: string;
}>;

export const initialState: SubscriptionsState = {
  isLoadingSubscriptions: false,
  isLoadingValidateSubscriptionReceipt: false,
  subscriptions: [] as Api.Subscription[],
  validationResult: {} as Api.ReceiptValidationResponse,
  error: ''
};

/* tslint:disable-next-line no-any */
export function subscriptionsReducer(state = initialState, action: any): SubscriptionsState {
  switch (action.type) {
    case GET_ACTIVE_SUBSCRIPTIONS:
      return {
        ...state,
        isLoadingSubscriptions: true,
        error: ''
      };

    case GET_ACTIVE_SUBSCRIPTIONS_SUCCESS:
      return {
        ...state,
        isLoadingSubscriptions: false,
        subscriptions: action.payload.data,
        error: ''
      };

    case GET_ACTIVE_SUBSCRIPTIONS_FAIL:
      let getSubscriptionsFailMessage = '';

      // Network error
      if (action.error && action.error.status === 0) {
        getSubscriptionsFailMessage = GENERIC_NETWORK_ERROR;
      } else {
        // Error, from the API
        if (action.error && action.error.response && action.error.response.data && action.error.response.data.message) {
          Analytics.trackEvent('Error get subscriptions', { message: action.error.response.data.message });
          getSubscriptionsFailMessage = action.error.response.data.message;
        } else {
          getSubscriptionsFailMessage = GET_ACTIVE_SUBSCRIPTIONS_FAIL_MESSAGE;
        }
      }

      return {
        ...state,
        isLoadingSubscriptions: false,
        error: getSubscriptionsFailMessage
      };

    case POST_VALIDATE_SUBSCRIPTION_RECEIPT:
      return {
        ...state,
        isLoadingValidateSubscriptionReceipt: true,
        error: ''
      };

    case POST_VALIDATE_SUBSCRIPTION_RECEIPT_SUCCESS:
      return {
        ...state,
        isLoadingValidateSubscriptionReceipt: false,
        validationResult: action.payload.data,
        error: ''
      };

    case POST_VALIDATE_SUBSCRIPTION_RECEIPT_FAIL:
      let postValidateSubscriptionReceiptFailMessage = '';

      // Network error
      if (action.error && action.error.status === 0) {
        postValidateSubscriptionReceiptFailMessage = GENERIC_NETWORK_ERROR;
      } else {
        // Error, from the API
        if (action.error && action.error.response && action.error.response.data && action.error.response.data.message) {
          Analytics.trackEvent('Error post validate subscription receipt', { message: action.error.response.data.message });
          postValidateSubscriptionReceiptFailMessage = action.error.response.data.message;
        } else {
          postValidateSubscriptionReceiptFailMessage = POST_VALIDATE_SUBSCRIPTION_RECEIPT_FAIL_MESSAGE;
        }
      }

      return {
        ...state,
        isLoadingValidateSubscriptionReceipt: false,
        error: postValidateSubscriptionReceiptFailMessage
      };

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

export function getActiveSubscriptions() {
  return {
    type: GET_ACTIVE_SUBSCRIPTIONS,
    payload: {
      request: {
        method: 'get',
        url: '/v1/in-app-subscriptions/active'
      }
    }
  };
}

export function validateSubscriptionReceipt(subscriptionId: string, latestReceipt: string) {
  return {
    type: POST_VALIDATE_SUBSCRIPTION_RECEIPT,
    payload: {
      request: {
        method: 'post',
        url: `/v1/in-app-subscriptions/${subscriptionId}/validate`,
        data: {
          receipt: latestReceipt
        }
      }
    }
  };
}
