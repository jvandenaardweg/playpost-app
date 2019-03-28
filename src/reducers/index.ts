import { combineReducers, Action } from 'redux';
import { AxiosResponse, AxiosRequestConfig } from 'axios';

import { playerReducer } from './player';
import { authReducer } from './auth';
import { userReducer } from './user';
import { playlistsReducer } from './playlists';
import { audiofilesReducer } from './audiofiles';

/* tslint:disable no-any */
export interface AxiosActionResponse extends AxiosResponse {
  payload: {
    data: any
  };
}

export interface AxiosAction extends Action {
  payload: {
    request: AxiosRequestConfig
  };
}

const rootReducer = combineReducers({
  player: playerReducer,
  auth: authReducer,
  user: userReducer,
  playlists: playlistsReducer,
  audiofiles: audiofilesReducer
});

export type RootState = ReturnType<typeof rootReducer>;

export { rootReducer };
