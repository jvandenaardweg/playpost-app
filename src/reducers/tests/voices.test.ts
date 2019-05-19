import { voicesReducer, initialState } from '../voices';

describe('voices reducer', () => {
  it('should return the initial state', () => {
    expect(voicesReducer(undefined, {})).toEqual(initialState);
  });
});
