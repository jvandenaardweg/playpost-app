import subscriptionValidationResultActiveMock from '../../../tests/__mocks__/subscription-validation-result-active';
import subscriptionsMock from '../../../tests/__mocks__/subscriptions';
import { GET_IN_APP_SUBSCRIPTIONS_FAIL_MESSAGE, POST_VALIDATE_SUBSCRIPTION_RECEIPT_FAIL_MESSAGE } from '../../constants/messages';
import { GET_IN_APP_SUBSCRIPTIONS, GET_IN_APP_SUBSCRIPTIONS_FAIL, GET_IN_APP_SUBSCRIPTIONS_SUCCESS, initialState, POST_VALIDATE_SUBSCRIPTION_RECEIPT, POST_VALIDATE_SUBSCRIPTION_RECEIPT_FAIL, POST_VALIDATE_SUBSCRIPTION_RECEIPT_SUCCESS, RESET_SUBSCRIPTIONS_STATE, RESET_VALIDATE_SUBSCRIPTION_RECEIPT_ERROR, SET_IS_ACTIVE_UPGRADE_MODAL, SET_IS_LOADING_RESTORE, SET_IS_LOADING_UPGRADE, subscriptionsReducer } from '../subscriptions';

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

  it('should handle GET_IN_APP_SUBSCRIPTIONS', () => {
    const expectedState = {
      ...initialState,
      isLoadingSubscriptions: true,
      error: ''
    };

    expect(
      subscriptionsReducer(initialState, {
        type: GET_IN_APP_SUBSCRIPTIONS
      })
    ).toEqual(expectedState);
  });

  it('should handle GET_IN_APP_SUBSCRIPTIONS_SUCCESS', () => {
    const expectedState = {
      ...initialState,
      isLoadingSubscriptions: false,
      subscriptions: subscriptionsMock,
      error: ''
    };

    expect(
      subscriptionsReducer(initialState, {
        type: GET_IN_APP_SUBSCRIPTIONS_SUCCESS,
        payload: {
          data: subscriptionsMock
        }
      })
    ).toEqual(expectedState);
  });

  it('should handle GET_IN_APP_SUBSCRIPTIONS_FAIL', () => {
    const expectedState = {
      ...initialState,
      isLoadingSubscriptions: false,
      error: GET_IN_APP_SUBSCRIPTIONS_FAIL_MESSAGE
    };

    expect(
      subscriptionsReducer(initialState, {
        type: GET_IN_APP_SUBSCRIPTIONS_FAIL,
        payload: {
          data: {
            error: GET_IN_APP_SUBSCRIPTIONS_FAIL_MESSAGE
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

    expect(
      subscriptionsReducer(changedState, {
        type: RESET_VALIDATE_SUBSCRIPTION_RECEIPT_ERROR
      })
    ).toEqual(expectedState);
  });

  it('should handle SET_IS_LOADING_UPGRADE', () => {
    const expectedState = {
      ...initialState,
      isLoadingUpgrade: true
    };

    expect(
      subscriptionsReducer(initialState, {
        type: SET_IS_LOADING_UPGRADE,
        payload: true
      })
    ).toEqual(expectedState);
  });

  it('should handle SET_IS_LOADING_RESTORE', () => {
    const expectedState = {
      ...initialState,
      isLoadingRestore: true
    };

    expect(
      subscriptionsReducer(initialState, {
        type: SET_IS_LOADING_RESTORE,
        payload: true
      })
    ).toEqual(expectedState);
  });

  it('should handle SET_IS_ACTIVE_UPGRADE_MODAL', () => {
    const expectedState = {
      ...initialState,
      isActiveUpgradeModal: true
    };

    expect(
      subscriptionsReducer(initialState, {
        type: SET_IS_ACTIVE_UPGRADE_MODAL,
        payload: true
      })
    ).toEqual(expectedState);
  });

  it('should handle SET_IS_ACTIVE_UPGRADE_MODAL', () => {
    const expectedState = {
      ...initialState,
      isActiveUpgradeModal: false
    };

    expect(
      subscriptionsReducer(initialState, {
        type: SET_IS_ACTIVE_UPGRADE_MODAL,
        payload: false
      })
    ).toEqual(expectedState);
  });
});
