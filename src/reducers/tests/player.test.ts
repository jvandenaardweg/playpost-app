import { playerReducer, initialState } from '../player';

describe('player reducer', () => {
  it('should return the initial state', () => {
    expect(playerReducer(undefined, {})).toEqual(initialState);
  });
});
