export const GET_TRACK = 'player/LOAD';
export const GET_TRACK_SUCCESS = 'player/LOAD_SUCCESS';
export const GET_TRACK_FAIL = 'player/LOAD_FAIL';

export function playerReducer(state = { track: null }, action) {
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
