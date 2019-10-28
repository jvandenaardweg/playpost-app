import crashlytics from '@react-native-firebase/crashlytics';
import { AnyAction } from 'redux';
// tslint:disable-next-line:no-submodule-imports
import { all, call, put, takeLatest } from 'redux-saga/effects';

import * as API from '../api/playlist';
import { ARCHIVE_PLAYLIST_ITEM, CREATE_PLAYLIST_ITEM_BY_ID, DELETE_PLAYLIST_ITEM, FAVORITE_PLAYLIST_ITEM, getPlaylist, setPlaylistError, setPlaylistIsLoadingArchiveItem, setPlaylistIsLoadingCreateItem, setPlaylistIsLoadingDeleteItem, setPlaylistIsLoadingFavoriteItem, setPlaylistIsLoadingUnarchiveItem, setPlaylistIsLoadingUnFavoriteItem, UNARCHIVE_PLAYLIST_ITEM, UNFAVORITE_PLAYLIST_ITEM } from '../reducers/playlist'

/**
 * Adds an article to the user's playlist by using a known articleID.
 * For example: when a user clicks a "Save to playlist" button on one of our embedded players to add that article to his playlist.
 *
 * @param articleId string
 */
export function* sagaAddArticleToPlaylistByArticleId({ articleId }: AnyAction) {
  try {
    // Set the state we are loading
    yield put(setPlaylistIsLoadingCreateItem(true));

    // Add the article to the user's playlist on the API
    yield call(API.postArticleToPlaylistById, articleId);

    // After a success, get the user's playlist containing the new article
    yield put(getPlaylist());

    // Hide the loader when done
    yield put(setPlaylistIsLoadingCreateItem(false));

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

/**
 * Archive an playlist item using the article ID of the playlist item.
 *
 * The archiving happens locally, and after that an API call is send to the API.
 * So, if the archiving fails, the archived item will be reset after we get the user's playlist, so he can try again.
 *
 * @param articleId string
 */
export function* sagaArchivePlaylistItem({ articleId }: AnyAction) {
  try {
    // Set the state we are loading
    // Also, already archive the article locally
    yield put(setPlaylistIsLoadingArchiveItem(true, articleId));

    // Archive the article
    yield call(API.patchArchivePlaylistItem, articleId);

    // After a success, get the user's playlist containing the new article
    yield put(getPlaylist())

    yield put(setPlaylistIsLoadingArchiveItem(false, articleId));
  } catch (err) {
    let errorMessage = 'Unknown error';

    if (err.response && err.response.data && err.response.data.message) {
      errorMessage = err.response.data.message;
    }

    // Set the error message, so we can display it to the user using our APIErrorAlertContainer
    yield put(setPlaylistError(errorMessage));

    // Set loading to false, removing the loading indicator from the user's screen
    yield put(setPlaylistIsLoadingArchiveItem(false, articleId));
    yield put(getPlaylist())

    // Log error
    crashlytics().recordError(new Error(errorMessage));

    return err;
  }
}

/**
 * Unarchive an playlist item using the article ID of the playlist item.
 *
 * The unarchiving happens locally, and after that an API call is send to the API.
 * So, if the unarchiving fails, the unarchived item will be reset after we get the user's playlist, so he can try again.
 *
 * @param articleId string
 */
export function* sagaUnarchivePlaylistItem({ articleId }: AnyAction) {
  try {
    // Set the state we are loading
    // Also, already archive the article locally
    yield put(setPlaylistIsLoadingUnarchiveItem(true, articleId));

    // Archive the article
    yield call(API.patchUnarchivePlaylistItem, articleId);

    // After a success, get the user's playlist containing the new article
    yield put(getPlaylist());

    yield put(setPlaylistIsLoadingUnarchiveItem(false, articleId));
  } catch (err) {
    let errorMessage = 'Unknown error';

    if (err.response && err.response.data && err.response.data.message) {
      errorMessage = err.response.data.message;
    }

    // Set the error message, so we can display it to the user using our APIErrorAlertContainer
    yield put(setPlaylistError(errorMessage));

    // Set loading to false, removing the loading indicator from the user's screen
    yield put(setPlaylistIsLoadingUnarchiveItem(false, articleId));
    yield put(getPlaylist())

    // Log error
    crashlytics().recordError(new Error(errorMessage));

    return err;
  }
}

export function* sagaFavoritePlaylistItem({ articleId }: AnyAction) {
  try {
    // Set the state we are loading
    // Also, already archive the article locally
    yield put(setPlaylistIsLoadingFavoriteItem(true));

    // Archive the article
    yield call(API.patchFavoritePlaylistItem, articleId);

    // After a success, get the user's playlist containing the new article
    yield put(getPlaylist());

    yield put(setPlaylistIsLoadingFavoriteItem(false));
  } catch (err) {
    let errorMessage = 'Unknown error';

    if (err.response && err.response.data && err.response.data.message) {
      errorMessage = err.response.data.message;
    }

    // Set the error message, so we can display it to the user using our APIErrorAlertContainer
    yield put(setPlaylistError(errorMessage));

    // Set loading to false, removing the loading indicator from the user's screen
    yield put(setPlaylistIsLoadingFavoriteItem(false));
    yield put(getPlaylist())

    // Log error
    crashlytics().recordError(new Error(errorMessage));

    return err;
  }
}

export function* sagaUnFavoritePlaylistItem({ articleId }: AnyAction) {
  try {
    // Set the state we are loading
    // Also, already archive the article locally
    yield put(setPlaylistIsLoadingUnFavoriteItem(true));

    // Archive the article
    yield call(API.patchUnFavoritePlaylistItem, articleId);

    // After a success, get the user's playlist containing the new article
    yield put(getPlaylist());

    yield put(setPlaylistIsLoadingUnFavoriteItem(false));
  } catch (err) {
    let errorMessage = 'Unknown error';

    if (err.response && err.response.data && err.response.data.message) {
      errorMessage = err.response.data.message;
    }

    // Set the error message, so we can display it to the user using our APIErrorAlertContainer
    yield put(setPlaylistError(errorMessage));

    // Set loading to false, removing the loading indicator from the user's screen
    yield put(setPlaylistIsLoadingUnFavoriteItem(false));
    yield put(getPlaylist())

    // Log error
    crashlytics().recordError(new Error(errorMessage));

    return err;
  }
}

export function* sagaDeleteArticleFromPlaylist({ articleId }: AnyAction) {
  try {
    // Set the state we are loading
    // Also, already archive the article locally
    yield put(setPlaylistIsLoadingDeleteItem(true, articleId));

    // Archive the article
    yield call(API.deleteArticleFromPlaylist, articleId);

    // After a success, get the user's playlist containing the new article
    yield put(getPlaylist());

    yield put(setPlaylistIsLoadingDeleteItem(false, articleId));
  } catch (err) {
    let errorMessage = 'Unknown error';

    if (err.response && err.response.data && err.response.data.message) {
      errorMessage = err.response.data.message;
    }

    // Set the error message, so we can display it to the user using our APIErrorAlertContainer
    yield put(setPlaylistError(errorMessage));

    // Set loading to false, removing the loading indicator from the user's screen
    yield put(setPlaylistIsLoadingDeleteItem(false, articleId));
    yield put(getPlaylist())

    // Log error
    crashlytics().recordError(new Error(errorMessage));

    return err;
  }
}

export function* watchCreatePlaylistItemByArticleId() {
  yield takeLatest(CREATE_PLAYLIST_ITEM_BY_ID, sagaAddArticleToPlaylistByArticleId);
}

export function* watchArchivePlaylistItem() {
  yield takeLatest(ARCHIVE_PLAYLIST_ITEM, sagaArchivePlaylistItem);
}

export function* watchUnarchivePlaylistItem() {
  yield takeLatest(UNARCHIVE_PLAYLIST_ITEM, sagaUnarchivePlaylistItem);
}

export function* watchFavoritePlaylistItem() {
  yield takeLatest(FAVORITE_PLAYLIST_ITEM, sagaFavoritePlaylistItem);
}

export function* watchUnFavoritePlaylistItem() {
  yield takeLatest(UNFAVORITE_PLAYLIST_ITEM, sagaUnFavoritePlaylistItem);
}

export function* watchDeleteArticleFromPlaylist() {
  yield takeLatest(DELETE_PLAYLIST_ITEM, sagaDeleteArticleFromPlaylist);
}

export function* playlistSaga() {
  yield all([
    watchCreatePlaylistItemByArticleId(),
    watchArchivePlaylistItem(),
    watchUnarchivePlaylistItem(),
    watchFavoritePlaylistItem(),
    watchUnFavoritePlaylistItem(),
    watchDeleteArticleFromPlaylist()
  ]);
}
