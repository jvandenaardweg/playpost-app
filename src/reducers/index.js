import { articlesReducer } from './articles';
import { playerReducer } from './player';

const rootReducer = {
  articles: articlesReducer,
  player: playerReducer
};

export default rootReducer;
