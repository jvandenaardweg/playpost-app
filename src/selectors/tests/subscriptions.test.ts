import {
  subscriptionsSelector,
  selectSubscriptions,
  selectIsLoadingSubscriptions,
  selectSubscriptionsError,
  selectSubscriptionsValidationResult,
  selectSubscriptionLatestReceipt,
  selectIsSubscribed,
  selectErrorValidateSubscriptionReceipt,
  selectActiveSubscriptionProductId
} from '../subscriptions';
import { createStore } from 'redux';

import { initialState } from '../../reducers/subscriptions';
import { rootReducer } from '../../reducers';

import subscriptionsMock from '../../../tests/__mocks__/subscriptions';
import subscriptionValidationResultExpiredMock from '../../../tests/__mocks__/subscription-validation-result-expired';
import subscriptionValidationResultActiveMock from '../../../tests/__mocks__/subscription-validation-result-active';

const store = createStore(rootReducer);

const rootState = store.getState();
// const userStore = rootState.user;

describe('subscriptions selector', () => {
  it('subscriptionsSelector should return the initial state', () => {
    expect(subscriptionsSelector(rootState)).toEqual(initialState);
  });

  it('selectSubscriptions should return the subscriptions', () => {
    const exampleState = {
      ...rootState,
      subscriptions: {
        ...rootState.subscriptions,
        subscriptions: subscriptionsMock
      }
    };

    expect(selectSubscriptions(exampleState)).toEqual(subscriptionsMock);
  });

  it('selectIsLoadingSubscriptions should return the loading state', () => {
    const exampleState = {
      ...rootState,
      subscriptions: {
        ...rootState.subscriptions,
        isLoadingSubscriptions: true
      }
    };

    expect(selectIsLoadingSubscriptions(exampleState)).toBe(true);
  });

  it('selectSubscriptionsError should return the error', () => {
    const exampleState = {
      ...rootState,
      subscriptions: {
        ...rootState.subscriptions,
        error: 'Some example error'
      }
    };

    expect(selectSubscriptionsError(exampleState)).toBe('Some example error');
  });

  it('selectErrorValidateSubscriptionReceipt should return the error', () => {
    const exampleState = {
      ...rootState,
      subscriptions: {
        ...rootState.subscriptions,
        errorValidateSubscriptionReceipt: 'Some example error'
      }
    };

    expect(selectErrorValidateSubscriptionReceipt(exampleState)).toBe('Some example error');
  });

  it('selectSubscriptionsValidationResult should return the subscription validation result', () => {
    const exampleState = {
      ...rootState,
      subscriptions: {
        ...rootState.subscriptions,
        validationResult: subscriptionValidationResultExpiredMock
      }
    };

    expect(selectSubscriptionsValidationResult(exampleState)).toEqual(subscriptionValidationResultExpiredMock);
  });

  it('selectSubscriptionLatestReceipt should return the subscription latest receipt', () => {
    const exampleState = {
      ...rootState,
      subscriptions: {
        ...rootState.subscriptions,
        validationResult: subscriptionValidationResultExpiredMock
      }
    };

    expect(selectSubscriptionLatestReceipt(exampleState)).toEqual(subscriptionValidationResultExpiredMock.latestReceipt);
  });

  it('selectIsSubscribed should return the subscription latest receipt', () => {
    const exampleState = {
      ...rootState,
      subscriptions: {
        ...rootState.subscriptions,
        validationResult: subscriptionValidationResultExpiredMock
      }
    };

    // The mock data contains a unsubscribed/expired subscription
    expect(selectIsSubscribed(exampleState)).toEqual(false);
  });

  it('selectActiveSubscriptionProductId should return the default productId "free" when there are no active subscriptions', () => {
    const exampleState = {
      ...rootState,
      subscriptions: {
        ...rootState.subscriptions,
        validationResult: subscriptionValidationResultExpiredMock
      }
    };

    // The mock data contains a unsubscribed/expired subscription
    expect(selectActiveSubscriptionProductId(exampleState)).toEqual('free');
  });

  it('selectActiveSubscriptionProductId should return the active subscription productId', () => {
    const exampleState = {
      ...rootState,
      subscriptions: {
        ...rootState.subscriptions,
        validationResult: subscriptionValidationResultActiveMock
      }
    };

    // The mock data contains a unsubscribed/expired subscription
    expect(selectActiveSubscriptionProductId(exampleState)).toEqual('com.aardwegmedia.playpost.premium');
  });
});
