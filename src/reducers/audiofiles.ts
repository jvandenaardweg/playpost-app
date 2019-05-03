
import { AxiosError, AxiosResponse } from 'axios';

export const SET_DOWNLOADED_AUDIOFILE = 'audiofiles/SET_DOWNLOADED_AUDIOFILE';
export const RESET_STATE = 'audiofiles/RESET_STATE';

export type AudiofilesState = Readonly<{
  isLoading: boolean;
  downloaded: ReadonlyArray<Api.Audiofile>;
  error: string;
}>;

const initialState: AudiofilesState = {
  isLoading: false,
  downloaded: [],
  error: ''
};

/* tslint:disable no-any */
type AudiofilesActionTypes = {
  type: string;
  payload: any;
  error: AxiosError & AxiosResponse;
};

/* tslint:disable no-any */
export function audiofilesReducer(state = initialState, action: AudiofilesActionTypes): AudiofilesState {
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

export const resetAudiofilesState = () => ({
  type: RESET_STATE
});

export const setDownloadedAudiofile = (audiofile: Api.Audiofile) => ({
  type: SET_DOWNLOADED_AUDIOFILE,
  payload: audiofile
});
