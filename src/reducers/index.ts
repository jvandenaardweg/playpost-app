import { combineReducers } from 'redux';

import { playerReducer } from './player';
import { authReducer } from './auth';
import { userReducer } from './user';
import { playlistsReducer } from './playlists';

const rootReducer = combineReducers({
  player: playerReducer,
  auth: authReducer,
  user: userReducer,
  playlists: playlistsReducer
});

export type RootState = ReturnType<typeof rootReducer>;

export { rootReducer };
