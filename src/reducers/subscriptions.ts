import Analytics from 'appcenter-analytics';
import { GENERIC_NETWORK_ERROR, GET_SUBSCRIPTIONS_FAIL_MESSAGE } from '../constants/messages';

export const RESET_SUBSCRIPTIONS_STATE = 'subscriptions/RESET_SUBSCRIPTIONS_STATE';

export const GET_SUBSCRIPTIONS = 'subscriptions/GET_SUBSCRIPTIONS';
export const GET_SUBSCRIPTIONS_SUCCESS = 'subscriptions/GET_SUBSCRIPTIONS_SUCCESS';
export const GET_SUBSCRIPTIONS_FAIL = 'subscriptions/GET_SUBSCRIPTIONS_FAIL';

export type SubscriptionsState = Readonly<{
  isLoadingSubscriptions: boolean;
  subscriptions: Api.Subscription[];
  error: string;
}>;

export const initialState: SubscriptionsState = {
  isLoadingSubscriptions: false,
  subscriptions: [] as Api.Subscription[],
  error: ''
};

/* tslint:disable-next-line no-any */
export function subscriptionsReducer(state = initialState, action: any): SubscriptionsState {
  switch (action.type) {
    case GET_SUBSCRIPTIONS:
      return {
        ...state,
        isLoadingSubscriptions: true,
        error: ''
      };

    case GET_SUBSCRIPTIONS_SUCCESS:
      return {
        ...state,
        isLoadingSubscriptions: false,
        subscriptions: action.payload.data,
        error: ''
      };

    case GET_SUBSCRIPTIONS_FAIL:
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
          getSubscriptionsFailMessage = GET_SUBSCRIPTIONS_FAIL_MESSAGE;
        }
      }

      return {
        ...state,
        isLoadingSubscriptions: false,
        error: getSubscriptionsFailMessage
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

export function getSubscriptions() {
  return {
    type: GET_SUBSCRIPTIONS,
    payload: {
      request: {
        method: 'get',
        url: '/v1/subscriptions/active'
      }
    }
  };
}
