import { articlesReducer } from './articles';
import { playerReducer } from './player';
import { authReducer } from './auth';
import { usersReducer } from './users';

const rootReducer = {
  articles: articlesReducer,
  player: playerReducer,
  auth: authReducer,
  users: usersReducer
};

export default rootReducer;
