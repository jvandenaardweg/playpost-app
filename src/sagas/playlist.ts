import { AnyAction } from 'redux';
// tslint:disable-next-line:no-submodule-imports
import { all, call, put, takeLatest } from 'redux-saga/effects';

import * as API from '../api/playlist';
import { CREATE_PLAYLIST_ITEM_BY_ID, getPlaylist, setPlaylistError } from '../reducers/playlist'

export function* addArticleToPlaylistByArticleId({ articleId }: AnyAction) {
  try {
    // Add the article to the user's playlist on the API
    yield call(API.postArticleToPlaylistById, articleId);

    // After a success, get the user's playlist containing the new article
    yield put(getPlaylist())
  } catch (err) {
    let errorMessage = 'Unknown error';
    if (err.response && err.response.data && err.response.data.message) {
      errorMessage = err.response.data.message;
    }
    yield put(setPlaylistError(errorMessage));
    return err;
  }
}

export function* watchCreatePlaylistItemByArticleId() {
  yield takeLatest(CREATE_PLAYLIST_ITEM_BY_ID, addArticleToPlaylistByArticleId);
}

export function* playlistSaga() {
  yield all([
    watchCreatePlaylistItemByArticleId()
  ]);
}
