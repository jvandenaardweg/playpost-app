import { articlesReducer } from './articles';
import { playerReducer } from './player';
import { authReducer } from './auth';
import { usersReducer } from './users';
import { meReducer } from './me';

const rootReducer = {
  articles: articlesReducer,
  player: playerReducer,
  auth: authReducer,
  users: usersReducer,
  me: meReducer
};

export default rootReducer;
