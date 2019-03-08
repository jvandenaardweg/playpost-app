import { playerReducer } from './player';
import { authReducer } from './auth';
import { usersReducer } from './users';
import { userReducer } from './user';

const rootReducer = {
  player: playerReducer,
  auth: authReducer,
  users: usersReducer,
  user: userReducer
};

export default rootReducer;
