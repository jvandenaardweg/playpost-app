import subscriptionValidationResultActiveMock from '../../../tests/__mocks__/subscription-validation-result-active';
import subscriptionsMock from '../../../tests/__mocks__/subscriptions';
import { GET_ACTIVE_SUBSCRIPTIONS_FAIL_MESSAGE, POST_VALIDATE_SUBSCRIPTION_RECEIPT_FAIL_MESSAGE } from '../../constants/messages';
import { GET_ACTIVE_SUBSCRIPTIONS, GET_ACTIVE_SUBSCRIPTIONS_FAIL, GET_ACTIVE_SUBSCRIPTIONS_SUCCESS, initialState, POST_VALIDATE_SUBSCRIPTION_RECEIPT, POST_VALIDATE_SUBSCRIPTION_RECEIPT_FAIL, POST_VALIDATE_SUBSCRIPTION_RECEIPT_SUCCESS, RESET_SUBSCRIPTIONS_STATE, RESET_VALIDATE_SUBSCRIPTION_RECEIPT_ERROR, subscriptionsReducer } from '../subscriptions';

describe('subscriptions reducer', () => {
  it('should return the initial state', () => {
    expect(subscriptionsReducer(undefined, {})).toEqual(initialState);
  });

  it('should handle RESET_SUBSCRIPTIONS_STATE', () => {
    const changedState = {
      ...initialState,
      error: 'An unknown error happened.'

    }
    const expectedState = {
      ...initialState,
      error: ''
    };

    // Test the reset
    expect(
      subscriptionsReducer(changedState, {
        type: RESET_SUBSCRIPTIONS_STATE
      })
    ).toEqual(expectedState);
  });

  it('should handle GET_ACTIVE_SUBSCRIPTIONS', () => {
    const expectedState = {
      ...initialState,
      isLoadingSubscriptions: true,
      error: ''
    };

    expect(
      subscriptionsReducer(initialState, {
        type: GET_ACTIVE_SUBSCRIPTIONS
      })
    ).toEqual(expectedState);
  });

  it('should handle GET_ACTIVE_SUBSCRIPTIONS_SUCCESS', () => {
    const expectedState = {
      ...initialState,
      isLoadingSubscriptions: false,
      subscriptions: subscriptionsMock,
      error: ''
    };

    expect(
      subscriptionsReducer(initialState, {
        type: GET_ACTIVE_SUBSCRIPTIONS_SUCCESS,
        payload: {
          data: subscriptionsMock
        }
      })
    ).toEqual(expectedState);
  });

  it('should handle GET_ACTIVE_SUBSCRIPTIONS_FAIL', () => {
    const expectedState = {
      ...initialState,
      isLoadingSubscriptions: false,
      error: GET_ACTIVE_SUBSCRIPTIONS_FAIL_MESSAGE
    };

    expect(
      subscriptionsReducer(initialState, {
        type: GET_ACTIVE_SUBSCRIPTIONS_FAIL,
        payload: {
          data: {
            error: GET_ACTIVE_SUBSCRIPTIONS_FAIL_MESSAGE
          }
        }
      })
    ).toEqual(expectedState);
  });

  it('should handle POST_VALIDATE_SUBSCRIPTION_RECEIPT', () => {
    const expectedState = {
      ...initialState,
      isLoadingValidateSubscriptionReceipt: true,
      errorValidateSubscriptionReceipt: ''
    };

    expect(
      subscriptionsReducer(initialState, {
        type: POST_VALIDATE_SUBSCRIPTION_RECEIPT
      })
    ).toEqual(expectedState);
  });

  it('should handle POST_VALIDATE_SUBSCRIPTION_RECEIPT_SUCCESS', () => {
    const expectedState = {
      ...initialState,
      isLoadingValidateSubscriptionReceipt: false,
      validationResult: subscriptionValidationResultActiveMock,
      errorValidateSubscriptionReceipt: ''
    };

    expect(
      subscriptionsReducer(initialState, {
        type: POST_VALIDATE_SUBSCRIPTION_RECEIPT_SUCCESS,
        payload: {
          data: subscriptionValidationResultActiveMock
        }
      })
    ).toEqual(expectedState);
  });

  it('should handle POST_VALIDATE_SUBSCRIPTION_RECEIPT_FAIL', () => {
    const expectedState = {
      ...initialState,
      isLoadingValidateSubscriptionReceipt: false,
      errorValidateSubscriptionReceipt: POST_VALIDATE_SUBSCRIPTION_RECEIPT_FAIL_MESSAGE
    };

    expect(
      subscriptionsReducer(initialState, {
        type: POST_VALIDATE_SUBSCRIPTION_RECEIPT_FAIL,
        payload: {
          data: {
            error: POST_VALIDATE_SUBSCRIPTION_RECEIPT_FAIL_MESSAGE
          }
        }
      })
    ).toEqual(expectedState);
  });

  it('should handle RESET_VALIDATE_SUBSCRIPTION_RECEIPT_ERROR', () => {
    const changedState = {
      ...initialState,
      errorValidateSubscriptionReceipt: POST_VALIDATE_SUBSCRIPTION_RECEIPT_FAIL_MESSAGE
    }

    const expectedState = {
      ...initialState,
      errorValidateSubscriptionReceipt: ''
    };

    // Test the reset
    expect(
      subscriptionsReducer(changedState, {
        type: RESET_VALIDATE_SUBSCRIPTION_RECEIPT_ERROR
      })
    ).toEqual(expectedState);
  });
});
