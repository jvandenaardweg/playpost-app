import {
  CREATE_USER_FAIL_MESSAGE,
  DELETE_USER_FAIL_MESSAGE,
  GET_USER_FAIL_MESSAGE,
  SAVE_SELECTED_VOICE_FAIL_MESSAGE,
  UPDATE_USER_EMAIL_FAIL_MESSAGE,
  UPDATE_USER_PASSWORD_FAIL_MESSAGE
} from '../../constants/messages';
import {
  CREATE_USER,
  CREATE_USER_FAIL,
  CREATE_USER_SUCCESS,
  DELETE_USER,
  DELETE_USER_FAIL,
  DELETE_USER_SUCCESS,
  GET_USER,
  GET_USER_FAIL,
  GET_USER_SUCCESS,
  initialState,
  RESET_SAVE_SELECTED_VOICE_ERROR,
  RESET_USER_ERROR,
  RESET_USER_STATE,
  SAVE_SELECTED_VOICE,
  SAVE_SELECTED_VOICE_FAIL,
  SAVE_SELECTED_VOICE_SUCCESS,
  SET_PLAYBACK_SPEED,
  UPDATE_USER_EMAIL,
  UPDATE_USER_EMAIL_FAIL,
  UPDATE_USER_EMAIL_SUCCESS,
  UPDATE_USER_PASSWORD,
  UPDATE_USER_PASSWORD_FAIL,
  UPDATE_USER_PASSWORD_SUCCESS,
  userReducer
} from '../user';

import userMock from '../../../tests/__mocks__/user-active-subscription';

describe('user reducer', () => {
  it('should return the initial state', () => {
    expect(userReducer(undefined, {})).toEqual(initialState);
  });

  it('should handle RESET_USER_STATE', () => {
    const expectedState = {
      ...initialState,
      error: GET_USER_FAIL_MESSAGE
    };

    // Add something to the store, so we can test the reset
    expect(
      userReducer(undefined, {
        type: GET_USER_FAIL
      })
    ).toEqual(expectedState);

    // Test the reset
    expect(
      userReducer(expectedState, {
        type: RESET_USER_STATE
      })
    ).toEqual(initialState);
  });

  it('should handle RESET_USER_ERROR', () => {
    const expectedState = {
      ...initialState,
      error: GET_USER_FAIL_MESSAGE
    };

    // Add something to the store, so we can test the reset
    expect(
      userReducer(undefined, {
        type: GET_USER_FAIL
      })
    ).toEqual(expectedState);

    // Test the reset
    expect(
      userReducer(expectedState, {
        type: RESET_USER_ERROR
      })
    ).toEqual(initialState);
  });

  it('should handle GET_USER', () => {
    const expectedState = {
      ...initialState,
      isLoading: true,
      error: ''
    };

    expect(
      userReducer(initialState, {
        type: GET_USER
      })
    ).toEqual(expectedState);
  });

  it('should handle GET_USER_SUCCESS', () => {
    const expectedState = {
      ...initialState,
      isLoading: false,
      details: userMock,
      error: ''
    };

    expect(
      userReducer(initialState, {
        type: GET_USER_SUCCESS,
        payload: {
          data: userMock
        }
      })
    ).toEqual(expectedState);
  });

  it('should handle GET_USER_FAIL', () => {
    const expectedState = {
      ...initialState,
      isLoading: false,
      details: null,
      error: GET_USER_FAIL_MESSAGE
    };

    expect(
      userReducer(initialState, {
        type: GET_USER_FAIL
      })
    ).toEqual(expectedState);
  });

  it('should handle CREATE_USER', () => {
    const expectedState = {
      ...initialState,
      isLoading: true,
      error: ''
    };

    expect(
      userReducer(initialState, {
        type: CREATE_USER
      })
    ).toEqual(expectedState);
  });

  it('should handle CREATE_USER_SUCCESS', () => {
    const expectedState = {
      ...initialState,
      isLoading: false,
      details: userMock,
      error: ''
    };

    expect(
      userReducer(initialState, {
        type: CREATE_USER_SUCCESS,
        payload: {
          data: userMock
        }
      })
    ).toEqual(expectedState);
  });

  it('should handle CREATE_USER_FAIL', () => {
    const expectedState = {
      ...initialState,
      isLoading: false,
      details: null,
      error: CREATE_USER_FAIL_MESSAGE
    };

    expect(
      userReducer(initialState, {
        type: CREATE_USER_FAIL
      })
    ).toEqual(expectedState);
  });

  it('should handle DELETE_USER', () => {
    const expectedState = {
      ...initialState,
      isLoadingDelete: true,
      error: ''
    };

    expect(
      userReducer(initialState, {
        type: DELETE_USER
      })
    ).toEqual(expectedState);
  });

  it('should handle DELETE_USER_SUCCESS', () => {
    const expectedState = {
      ...initialState,
      isLoadingDelete: false,
      error: ''
    };

    expect(
      userReducer(initialState, {
        type: DELETE_USER_SUCCESS
      })
    ).toEqual(expectedState);
  });

  it('should handle DELETE_USER_FAIL', () => {
    const expectedState = {
      ...initialState,
      isLoadingDelete: false,
      error: DELETE_USER_FAIL_MESSAGE
    };

    expect(
      userReducer(initialState, {
        type: DELETE_USER_FAIL
      })
    ).toEqual(expectedState);
  });

  it('should handle UPDATE_USER_PASSWORD', () => {
    const expectedState = {
      ...initialState,
      isLoadingUpdatePassword: true,
      error: ''
    };

    expect(
      userReducer(initialState, {
        type: UPDATE_USER_PASSWORD
      })
    ).toEqual(expectedState);
  });

  it('should handle UPDATE_USER_PASSWORD_SUCCESS', () => {
    const expectedState = {
      ...initialState,
      isLoadingUpdatePassword: false,
      error: ''
    };

    expect(
      userReducer(initialState, {
        type: UPDATE_USER_PASSWORD_SUCCESS
      })
    ).toEqual(expectedState);
  });

  it('should handle UPDATE_USER_PASSWORD_FAIL', () => {
    const expectedState = {
      ...initialState,
      isLoadingUpdatePassword: false,
      error: UPDATE_USER_PASSWORD_FAIL_MESSAGE
    };

    expect(
      userReducer(initialState, {
        type: UPDATE_USER_PASSWORD_FAIL
      })
    ).toEqual(expectedState);
  });

  it('should handle UPDATE_USER_EMAIL', () => {
    const expectedState = {
      ...initialState,
      isLoadingUpdateEmail: true,
      error: ''
    };

    expect(
      userReducer(initialState, {
        type: UPDATE_USER_EMAIL
      })
    ).toEqual(expectedState);
  });

  it('should handle UPDATE_USER_EMAIL_SUCCESS', () => {
    const expectedState = {
      ...initialState,
      isLoadingUpdateEmail: false,
      error: ''
    };

    expect(
      userReducer(initialState, {
        type: UPDATE_USER_EMAIL_SUCCESS
      })
    ).toEqual(expectedState);
  });

  it('should handle UPDATE_USER_EMAIL_FAIL', () => {
    const expectedState = {
      ...initialState,
      isLoadingUpdateEmail: false,
      error: UPDATE_USER_EMAIL_FAIL_MESSAGE
    };

    expect(
      userReducer(initialState, {
        type: UPDATE_USER_EMAIL_FAIL
      })
    ).toEqual(expectedState);
  });

  it('should handle SAVE_SELECTED_VOICE', () => {
    const expectedState = {
      ...initialState,
      isLoadingSaveSelectedVoice: true,
      errorSaveSelectedVoice: ''
    };

    expect(
      userReducer(initialState, {
        type: SAVE_SELECTED_VOICE
      })
    ).toEqual(expectedState);
  });

  it('should handle SAVE_SELECTED_VOICE_SUCCESS', () => {
    const expectedState = {
      ...initialState,
      isLoadingSaveSelectedVoice: false,
      errorSaveSelectedVoice: ''
    };

    expect(
      userReducer(initialState, {
        type: SAVE_SELECTED_VOICE_SUCCESS
      })
    ).toEqual(expectedState);
  });

  it('should handle SAVE_SELECTED_VOICE_FAIL', () => {
    const expectedState = {
      ...initialState,
      isLoadingSaveSelectedVoice: false,
      errorSaveSelectedVoice: SAVE_SELECTED_VOICE_FAIL_MESSAGE
    };

    expect(
      userReducer(initialState, {
        type: SAVE_SELECTED_VOICE_FAIL
      })
    ).toEqual(expectedState);
  });

  it('should handle RESET_SAVE_SELECTED_VOICE_ERROR', () => {
    const changedState = {
      ...initialState,
      errorSaveSelectedVoice: SAVE_SELECTED_VOICE_FAIL_MESSAGE
    }

    const expectedState = {
      ...initialState,
      errorSaveSelectedVoice: ''
    };

    // Test the reset
    expect(
      userReducer(changedState, {
        type: RESET_SAVE_SELECTED_VOICE_ERROR
      })
    ).toEqual(expectedState);
  });



  it('should handle SET_PLAYBACK_SPEED', () => {
    const expectedState = {
      ...initialState,
      playbackSpeed: 0.5
    };

    expect(
      userReducer(initialState, {
        type: SET_PLAYBACK_SPEED,
        payload: 0.5
      })
    ).toEqual(expectedState);
  });
});
