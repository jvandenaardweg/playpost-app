import { subscriptionsSelector, selectSubscriptions, selectIsLoadingSubscriptions, selectSubscriptionsError } from '../subscriptions';
import { createStore } from 'redux';

import { initialState } from '../../reducers/subscriptions';
import { rootReducer } from '../../reducers';

import subscriptionsMock from '../../../tests/__mocks__/subscriptions';

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

});
