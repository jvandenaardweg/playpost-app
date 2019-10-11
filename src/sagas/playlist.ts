import crashlytics from '@react-native-firebase/crashlytics';
import { AnyAction } from 'redux';
// tslint:disable-next-line:no-submodule-imports
import { all, call, put, takeLatest } from 'redux-saga/effects';

import * as API from '../api/playlist';
import { CREATE_PLAYLIST_ITEM_BY_ID, getPlaylist, setPlaylistError, setPlaylistIsLoadingCreateItem } from '../reducers/playlist'

/**
 * Adds an article to the user's playlist by using a known articleID.
 * For example: when a user clicks a "Save to playlist" button on one of our embedded players to add that article to his playlist.
 *
 * @param articleId string
 */
export function* addArticleToPlaylistByArticleId({ articleId }: AnyAction) {
  try {
    // Set the state we are loading
    yield put(setPlaylistIsLoadingCreateItem(true));

    // Add the article to the user's playlist on the API
    yield call(API.postArticleToPlaylistById, articleId);

    // After a success, get the user's playlist containing the new article
    yield put(getPlaylist())
  } catch (err) {
    let errorMessage = 'Unknown error';

    if (err.response && err.response.data && err.response.data.message) {
      errorMessage = err.response.data.message;
    }

    // Set the error message, so we can display it to the user using our APIErrorAlertContainer
    yield put(setPlaylistError(errorMessage));

    // Set loading to false, removing the loading indicator from the user's screen
    yield put(setPlaylistIsLoadingCreateItem(false));

    // Log error
    crashlytics().recordError(new Error(errorMessage));

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
