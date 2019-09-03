import { createStore } from 'redux';
import {
  selectErrorValidateSubscriptionReceipt,
  selectIsLoadingSubscriptions,
  selectSubscriptions,
  selectSubscriptionsError,
  selectSubscriptionsIsLoadingRestore,
  selectSubscriptionsIsLoadingUpgrade,
  selectSubscriptionsValidationResult,
  subscriptionsSelector
} from '../subscriptions';

import { rootReducer } from '../../reducers';
import { initialState } from '../../reducers/subscriptions';

// import subscriptionValidationResultActiveMock from '../../../tests/__mocks__/subscription-validation-result-active';
import subscriptionValidationResultExpiredMock from '../../../tests/__mocks__/subscription-validation-result-expired';
import subscriptionsMock from '../../../tests/__mocks__/subscriptions';

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

  it('selectSubscriptionsIsLoadingUpgrade should return true when isLoadingUpgrade is true', () => {
    const exampleState = {
      ...rootState,
      subscriptions: {
        ...rootState.subscriptions,
        isLoadingUpgrade: true
      }
    };

    expect(selectSubscriptionsIsLoadingUpgrade(exampleState)).toEqual(true);
  });

  it('selectSubscriptionsIsLoadingRestore should return true when isLoadingRestore is true', () => {
    const exampleState = {
      ...rootState,
      subscriptions: {
        ...rootState.subscriptions,
        isLoadingRestore: true
      }
    };

    expect(selectSubscriptionsIsLoadingRestore(exampleState)).toEqual(true);
  });
});
