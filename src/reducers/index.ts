import { playerReducer } from './player';
import { authReducer } from './auth';
import { userReducer } from './user';

const rootReducer = {
  player: playerReducer,
  auth: authReducer,
  user: userReducer
};

export default rootReducer;
