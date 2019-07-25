import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Action, combineReducers } from 'redux';

import { audiofilesReducer } from './audiofiles';
import { authReducer } from './auth';
import { playerReducer } from './player';
import { playlistReducer } from './playlist';
import { subscriptionsReducer } from './subscriptions';
import { userReducer } from './user';
import { voicesReducer } from './voices';

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

const rootState = {
  player: playerReducer,
  auth: authReducer,
  user: userReducer,
  playlist: playlistReducer,
  audiofiles: audiofilesReducer,
  voices: voicesReducer,
  subscriptions: subscriptionsReducer
};

const rootReducer = combineReducers(rootState);

export type RootState = ReturnType<typeof rootReducer>;

export { rootReducer, rootState };
