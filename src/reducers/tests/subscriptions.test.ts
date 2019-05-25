import { subscriptionsReducer, initialState } from '../subscriptions';

describe('subscriptions reducer', () => {
  it('should return the initial state', () => {
    expect(subscriptionsReducer(undefined, {})).toEqual(initialState);
  });
});
