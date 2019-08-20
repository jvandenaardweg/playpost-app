import { persistConfig } from '../index';
import { migrations } from '../migrations';

/**
 * These tests are just basic tests to make sure the methods keep returning the thing we expect to
 */
describe('store/migrations', () => {
  it('migrations should return an object with migations', () => {
    expect(Object.keys(migrations).length).toBeTruthy()
  });

  it('there should be atleast one migration with the version specified in the persistConfig', () => {
    const migrationKeys = Object.keys(migrations);
    const version = `${persistConfig.version}`;

    expect(migrationKeys.includes(version)).toBe(true)
  });

});
