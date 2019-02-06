export const GET_TRACK = 'tracks/LOAD';
export const GET_TRACK_SUCCESS = 'tracks/LOAD_SUCCESS';
export const GET_TRACK_FAIL = 'tracks/LOAD_FAIL';

export function tracksReducer(state = { track: null }, action) {
  switch (action.type) {
    case GET_TRACK:
      return {
        ...state,
        isLoading: true
      };
    case GET_TRACK_SUCCESS:
      return {
        ...state,
        isLoading: false,
        track: action.payload.data.publicFileUrl
      };
    case GET_TRACK_FAIL:
      return {
        ...state,
        isLoading: false,
        error: 'Error while fetching a track'
      };
    default:
      return state;
  }
}

export function getTrackByArticleUrl(articleUrl) {
  return {
    type: GET_TRACK,
    payload: {
      request: {
        url: `/audiofile?url=${articleUrl}`
      }
    }
  };
}
