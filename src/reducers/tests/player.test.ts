import {
  initialState,
  playerReducer,
  RESET_IS_CREATING_AUDIOFILE,
  RESET_IS_DOWNLOADING_AUDIOFILE,
  SET_IS_CREATING_AUDIOFILE,
  SET_IS_DOWNLOADING_AUDIOFILE,
  SET_PLAYBACK_STATUS,
  SET_TRACK
} from '../player';

import exampleTrack from '../../../tests/__mocks__/track';

describe('player reducer', () => {
  it('should return the initial state', () => {
    expect(playerReducer(undefined, {})).toEqual(initialState);
  });

  it('should handle SET_TRACK', () => {
    const exampleArticleId = '448d9d05-93e9-4756-a82d-1505597acf7d';

    const expectedState = {
      ...initialState,
      track: exampleTrack,
      currentArticleId: exampleArticleId,
      previousArticleId: ''
    };

    expect(
      playerReducer(initialState, {
        type: SET_TRACK,
        payload: {
          track: exampleTrack,
          articleId: exampleArticleId
        }
      })
    ).toEqual(expectedState);
  });

  it('should handle SET_TRACK with correct previousArticleId', () => {
    const exampleArticleId = '448d9d05-93e9-4756-a82d-1505597acf7d';
    const newArticleId = '50d9d844-93e9-4756-a82d-1505597acf7d';

    const expectedState = {
      ...initialState,
      track: exampleTrack,
      currentArticleId: newArticleId,
      previousArticleId: exampleArticleId
    };

    expect(
      playerReducer({...initialState, currentArticleId: exampleArticleId}, {
        type: SET_TRACK,
        payload: {
          track: exampleTrack,
          articleId: newArticleId
        }
      })
    ).toEqual(expectedState);
  });

  it('should handle SET_PLAYBACK_STATUS', () => {
    const examplePlaybackState = 'playing';

    const expectedState = {
      ...initialState,
      playbackState: examplePlaybackState
    };

    expect(
      playerReducer(initialState, {
        type: SET_PLAYBACK_STATUS,
        payload: examplePlaybackState
      })
    ).toEqual(expectedState);
  });

  it('should handle SET_IS_CREATING_AUDIOFILE', () => {
    const expectedState = {
      ...initialState,
      isCreatingAudiofile: true
    };

    expect(
      playerReducer(initialState, {
        type: SET_IS_CREATING_AUDIOFILE
      })
    ).toEqual(expectedState);
  });

  it('should handle RESET_IS_CREATING_AUDIOFILE', () => {
    const exampleState = {
      ...initialState,
      isCreatingAudiofile: true
    };

    expect(
      playerReducer(exampleState, {
        type: RESET_IS_CREATING_AUDIOFILE
      })
    ).toEqual(initialState);
  });

  it('should handle SET_IS_DOWNLOADING_AUDIOFILE', () => {
    const expectedState = {
      ...initialState,
      isDownloadingAudiofile: true
    };

    expect(
      playerReducer(initialState, {
        type: SET_IS_DOWNLOADING_AUDIOFILE
      })
    ).toEqual(expectedState);
  });

  it('should handle RESET_IS_DOWNLOADING_AUDIOFILE', () => {
    const exampleState = {
      ...initialState,
      isDownloadingAudiofile: true
    };

    expect(
      playerReducer(exampleState, {
        type: RESET_IS_DOWNLOADING_AUDIOFILE
      })
    ).toEqual(initialState);
  });
});
