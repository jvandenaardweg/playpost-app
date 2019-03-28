export const SET_DOWNLOADED_AUDIOFILE = 'audiofiles/SET_DOWNLOADED_AUDIOFILE';
export const RESET_STATE = 'audiofiles/RESET_STATE';

export interface AudiofilesState {
  isLoading: boolean;
  downloaded: Api.Audiofile[];
  error: string;
}

const initialState: AudiofilesState = {
  isLoading: false,
  downloaded: [],
  error: ''
};

export function audiofilesReducer(state = initialState, action: any): AudiofilesState {
  switch (action.type) {
    case SET_DOWNLOADED_AUDIOFILE:
      const audiofile: Api.Audiofile = action.payload;

      return {
        ...state,
        isLoading: false,
        downloaded: [
          ...state.downloaded.slice(0, 0),
          audiofile,
          ...state.downloaded.slice(0)
        ],
        error: ''
      };

    case RESET_STATE:
      return {
        ...initialState
      };

    default:
      return state;
  }
}

export function resetAudiofilesState() {
  return {
    type: RESET_STATE
  };
}

export function setDownloadedAudiofile(audiofile: Api.Audiofile) {
  return {
    type: SET_DOWNLOADED_AUDIOFILE,
    payload: audiofile
  };
}
