import { subscriptionsSelector, selectSubscriptions, selectIsLoadingSubscriptions, selectSubscriptionsError, selectSubscriptionByProductId, selectSubscriptionsValidationResult, selectSubscriptionLatestReceipt, selectIsSubscribed } from '../subscriptions';
import { createStore } from 'redux';

import { initialState } from '../../reducers/subscriptions';
import { rootReducer } from '../../reducers';

import subscriptionsMock from '../../../tests/__mocks__/subscriptions';
import subscriptionValidationResultMock from '../../../tests/__mocks__/subscription-validation-result';

const store = createStore(rootReducer);

const rootState = store.getState();
// const userStore = rootState.user;

describe('subscriptions selector', () => {

  it('should return the initial state', () => {
    expect(subscriptionsSelector(rootState)).toEqual(initialState);
  });

  it('should return the subscriptions', () => {
    const exampleState = {
      ...rootState,
      subscriptions: {
        ...rootState.subscriptions,
        subscriptions: subscriptionsMock
      }
    };

    expect(selectSubscriptions(exampleState)).toEqual(subscriptionsMock);
  });

  it('should return the loading state', () => {
    const exampleState = {
      ...rootState,
      subscriptions: {
        ...rootState.subscriptions,
        isLoadingSubscriptions: true
      }
    };

    expect(selectIsLoadingSubscriptions(exampleState)).toBe(true);
  });

  it('should return the error', () => {
    const exampleState = {
      ...rootState,
      subscriptions: {
        ...rootState.subscriptions,
        error: 'Some example error'
      }
    };

    expect(selectSubscriptionsError(exampleState)).toBe('Some example error');
  });

  it('should return the subscription by subscription id', () => {
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

  it('should return the subscription validation result', () => {
    const exampleState = {
      ...rootState,
      subscriptions: {
        ...rootState.subscriptions,
        validationResult: subscriptionValidationResultMock
      }
    };

    expect(selectSubscriptionsValidationResult(exampleState)).toEqual(subscriptionValidationResultMock);
  });

  it('should return the subscription latest receipt', () => {
    const exampleState = {
      ...rootState,
      subscriptions: {
        ...rootState.subscriptions,
        validationResult: subscriptionValidationResultMock
      }
    };

    expect(selectSubscriptionLatestReceipt(exampleState)).toEqual(subscriptionValidationResultMock.latestReceipt);
  });

  it('should return the subscription latest receipt', () => {
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
