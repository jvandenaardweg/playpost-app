import { playlistReducer, initialState } from '../playlist';

describe('playlist reducer', () => {
  it('should return the initial state', () => {
    expect(playlistReducer(undefined, {})).toEqual(initialState);
  });
});