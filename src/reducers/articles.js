export const GET_ARTICLES = 'articles/LOAD';
export const GET_ARTICLES_SUCCESS = 'articles/LOAD_SUCCESS';
export const GET_ARTICLES_FAIL = 'articles/LOAD_FAIL';

export function articlesReducer(state = { articles: [] }, action) {
  switch (action.type) {
    case GET_ARTICLES:
      return { ...state, isLoading: true };
    case GET_ARTICLES_SUCCESS:
      return { ...state, isLoading: false, articles: action.payload.data };
    case GET_ARTICLES_FAIL:
      return {
        ...state,
        isLoading: false,
        error: 'Error while fetching the articles'
      };
    default:
      return state;
  }
}

export function listArticles(user) {
  return {
    type: GET_ARTICLES,
    payload: {
      request: {
        url: `/users/${user}/repos`
      }
    }
  };
}
