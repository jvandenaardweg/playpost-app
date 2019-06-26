import { subscriptionsSelector, selectSubscriptions, selectIsLoadingSubscriptions, selectSubscriptionsError, selectSubscriptionByProductId, selectSubscriptionsValidationResult, selectSubscriptionLatestReceipt, selectIsSubscribed, selectErrorValidateSubscriptionReceipt } from '../subscriptions';
import { createStore } from 'redux';

import { initialState } from '../../reducers/subscriptions';
import { rootReducer } from '../../reducers';

import subscriptionsMock from '../../../tests/__mocks__/subscriptions';
import subscriptionValidationResultMock from '../../../tests/__mocks__/subscription-validation-result';

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

  it('selectSubscriptionByProductId should return the subscription by subscription id', () => {
    const exampleState = {
      ...rootState,
      subscriptions: {
        ...rootState.subscriptions,
        subscriptions: subscriptionsMock
      }
    };

    const productId = subscriptionsMock[0].productId;
    const expected = subscriptionsMock[0];

    expect(selectSubscriptionByProductId(exampleState, productId)).toEqual(expected);
  });

  it('selectSubscriptionsValidationResult should return the subscription validation result', () => {
    const exampleState = {
      ...rootState,
      subscriptions: {
        ...rootState.subscriptions,
        validationResult: subscriptionValidationResultMock
      }
    };

    expect(selectSubscriptionsValidationResult(exampleState)).toEqual(subscriptionValidationResultMock);
  });

  it('selectSubscriptionLatestReceipt should return the subscription latest receipt', () => {
    const exampleState = {
      ...rootState,
      subscriptions: {
        ...rootState.subscriptions,
        validationResult: subscriptionValidationResultMock
      }
    };

    expect(selectSubscriptionLatestReceipt(exampleState)).toEqual(subscriptionValidationResultMock.latestReceipt);
  });

  it('selectIsSubscribed should return the subscription latest receipt', () => {
    const exampleState = {
      ...rootState,
      subscriptions: {
        ...rootState.subscriptions,
        validationResult: subscriptionValidationResultMock
      }
    };

    // The mock data contains a unsubscribed/expired subscription
    expect(selectIsSubscribed(exampleState)).toEqual(false);
  });

});
