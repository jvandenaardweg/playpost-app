import { articlesReducer } from './articles';
import { tracksReducer } from './tracks';

const rootReducer = {
  articles: articlesReducer,
  tracks: tracksReducer
};

export default rootReducer;
