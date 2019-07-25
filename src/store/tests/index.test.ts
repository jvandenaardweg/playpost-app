import { persistor, store } from '../index';

/**
 * These tests are just basic tests to make sure the methods keep returning the thing we expect to
 */
describe('store/index', () => {
  it('store.getState() should return the initial store state', () => {
    expect(store.getState()).toMatchSnapshot();
  });

  it('persistor.getState() should return the initial store state', () => {
    expect(persistor.getState()).toMatchSnapshot();
  });

});
