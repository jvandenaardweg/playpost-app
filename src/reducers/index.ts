import { playerReducer } from './player';
import { authReducer } from './auth';
import { userReducer } from './user';
import { playlistsReducer } from './playlists';

const rootReducer = {
  player: playerReducer,
  auth: authReducer,
  user: userReducer,
  playlists: playlistsReducer
};

export default rootReducer;
