import { GENERIC_NETWORK_ERROR, GET_IN_APP_SUBSCRIPTIONS_FAIL_MESSAGE, POST_VALIDATE_SUBSCRIPTION_RECEIPT_FAIL_MESSAGE } from '../constants/messages';

export const RESET_SUBSCRIPTIONS_STATE = 'subscriptions/RESET_SUBSCRIPTIONS_STATE';

export const GET_IN_APP_SUBSCRIPTIONS = 'subscriptions/GET_IN_APP_SUBSCRIPTIONS';
export const GET_IN_APP_SUBSCRIPTIONS_SUCCESS = 'subscriptions/GET_IN_APP_SUBSCRIPTIONS_SUCCESS';
export const GET_IN_APP_SUBSCRIPTIONS_FAIL = 'subscriptions/GET_IN_APP_SUBSCRIPTIONS_FAIL';

export const SET_IS_LOADING_UPGRADE = 'subscriptions/SET_IS_LOADING_UPGRADE';
export const SET_IS_LOADING_RESTORE = 'subscriptions/SET_IS_LOADING_RESTORE';

export const SET_IS_ACTIVE_UPGRADE_MODAL = 'subscriptions/SET_IS_ACTIVE_UPGRADE_MODAL';

export const POST_VALIDATE_SUBSCRIPTION_RECEIPT = 'subscriptions/POST_VALIDATE_SUBSCRIPTION_RECEIPT';
export const POST_VALIDATE_SUBSCRIPTION_RECEIPT_SUCCESS = 'subscriptions/POST_VALIDATE_SUBSCRIPTION_RECEIPT_SUCCESS';
export const POST_VALIDATE_SUBSCRIPTION_RECEIPT_FAIL = 'subscriptions/POST_VALIDATE_SUBSCRIPTION_RECEIPT_FAIL';
export const RESET_VALIDATE_SUBSCRIPTION_RECEIPT_ERROR = 'subscriptions/RESET_VALIDATE_SUBSCRIPTION_RECEIPT_ERROR';

export type SubscriptionsState = Readonly<{
  isLoadingSubscriptions: boolean;
  isLoadingValidateSubscriptionReceipt: boolean;
  isLoadingUpgrade: boolean;
  isLoadingRestore: boolean;
  subscriptions: Api.InAppSubscription[] | null;
  validationResult: Api.ReceiptValidationResponseApple | Api.ReceiptValidationResponseGoogle | null;
  error: string;
  errorValidateSubscriptionReceipt: string;
  isActiveUpgradeModal: boolean;
}>;

export const initialState: SubscriptionsState = {
  isLoadingSubscriptions: false,
  isLoadingValidateSubscriptionReceipt: false,
  isLoadingUpgrade: false,
  isLoadingRestore: false,
  subscriptions: null,
  validationResult: null,
  error: '',
  errorValidateSubscriptionReceipt: '',
  isActiveUpgradeModal: false
};

/* tslint:disable-next-line no-any */
export function subscriptionsReducer(state = initialState, action: any): SubscriptionsState {
  switch (action.type) {
    case SET_IS_ACTIVE_UPGRADE_MODAL:
      return {
        ...state,
        isActiveUpgradeModal: action.payload,
      };

    case SET_IS_LOADING_UPGRADE:
      return {
        ...state,
        isLoadingUpgrade: action.payload,
      };

    case SET_IS_LOADING_RESTORE:
      return {
        ...state,
        isLoadingRestore: action.payload,
      };

    case GET_IN_APP_SUBSCRIPTIONS:
      return {
        ...state,
        isLoadingSubscriptions: true,
        error: ''
      };

    case GET_IN_APP_SUBSCRIPTIONS_SUCCESS:
      return {
        ...state,
        isLoadingSubscriptions: false,
        subscriptions: action.payload.data,
        error: ''
      };

    case GET_IN_APP_SUBSCRIPTIONS_FAIL:
      let getSubscriptionsFailMessage = '';

      // Network error
      if (action.error && action.error.status === 0) {
        getSubscriptionsFailMessage = GENERIC_NETWORK_ERROR;
      } else {
        // Error, from the API
        if (action.error && action.error.response && action.error.response.data && action.error.response.data.message) {
          getSubscriptionsFailMessage = action.error.response.data.message;
        } else {
          getSubscriptionsFailMessage = GET_IN_APP_SUBSCRIPTIONS_FAIL_MESSAGE;
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
        errorValidateSubscriptionReceipt: ''
      };

    case POST_VALIDATE_SUBSCRIPTION_RECEIPT_SUCCESS:
      return {
        ...state,
        isLoadingValidateSubscriptionReceipt: false,
        validationResult: action.payload.data,
        errorValidateSubscriptionReceipt: ''
      };

    case POST_VALIDATE_SUBSCRIPTION_RECEIPT_FAIL:
      let postValidateSubscriptionReceiptFailMessage = '';

      // Network error
      if (action.error && action.error.status === 0) {
        postValidateSubscriptionReceiptFailMessage = GENERIC_NETWORK_ERROR;
      } else {
        // Error, from the API
        if (action.error && action.error.response && action.error.response.data && action.error.response.data.message) {
          postValidateSubscriptionReceiptFailMessage = action.error.response.data.message;
        } else {
          postValidateSubscriptionReceiptFailMessage = POST_VALIDATE_SUBSCRIPTION_RECEIPT_FAIL_MESSAGE;
        }
      }

      return {
        ...state,
        isLoadingValidateSubscriptionReceipt: false,
        errorValidateSubscriptionReceipt: postValidateSubscriptionReceiptFailMessage
      };

    case RESET_VALIDATE_SUBSCRIPTION_RECEIPT_ERROR:
      return {
        ...initialState,
        errorValidateSubscriptionReceipt: ''
      };

    case RESET_SUBSCRIPTIONS_STATE:
      return {
        ...initialState
      };

    default:
      return state;
  }
}

export const setIsLoadingUpgrade = (isLoading: boolean) => ({
  type: SET_IS_LOADING_UPGRADE,
  payload: isLoading
});

export const setIsLoadingRestore = (isLoading: boolean) => ({
  type: SET_IS_LOADING_RESTORE,
  payload: isLoading
});

export const setIsActiveUpgradeModal = (isActive: boolean) => ({
  type: SET_IS_ACTIVE_UPGRADE_MODAL,
  payload: isActive
});

export const resetSubscriptionsState = () => ({
  type: RESET_SUBSCRIPTIONS_STATE
});

export const resetValidateSubscriptionReceiptError = () => ({
  type: RESET_VALIDATE_SUBSCRIPTION_RECEIPT_ERROR
});

export function getInAppSubscriptions() {
  return {
    type: GET_IN_APP_SUBSCRIPTIONS,
    payload: {
      request: {
        method: 'get',
        url: '/v1/in-app-subscriptions'
      }
    }
  };
}

export function validateSubscriptionReceipt(productId: string, latestReceipt: string, platform: string) {
  return {
    type: POST_VALIDATE_SUBSCRIPTION_RECEIPT,
    payload: {
      request: {
        method: 'post',
        url: '/v1/in-app-subscriptions/validate',
        data: {
          platform,
          productId,
          receipt: latestReceipt
        }
      }
    }
  };
}
