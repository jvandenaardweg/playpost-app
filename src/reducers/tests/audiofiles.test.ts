import { audiofilesReducer, initialState } from '../audiofiles';

describe('audiofiles reducer', () => {
  it('should return the initial state', () => {
    expect(audiofilesReducer(undefined, {})).toEqual(initialState);
  });
});
