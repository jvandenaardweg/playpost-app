import { put, all, call, takeLatest } from 'redux-saga/effects';
import { AnyAction } from 'redux';
import * as Keychain from 'react-native-keychain';

import { setAuthToken, setAuthError, GET_AUTH_TOKEN, resetAuthError } from '../reducers/auth';
import * as API from '../api/auth';

export function* authorize({ email, password }: AnyAction) {
  try {
    // Reset the error message that's maybe there from a previous request
    yield put(resetAuthError());

    // Get a token from the API
    const { data } = yield call(API.getAuthToken, email, password);
    const token = data.token;

    if (!token) {
      throw 'Did not receive the correct data from the server. Please try again.';
    }

    // Save the token in the store
    yield put(setAuthToken(token));

    // Save the token in the Keychain
    yield call([Keychain, Keychain.setGenericPassword], 'token', token, { accessGroup: 'group.playpost', service: 'com.aardwegmedia.playpost' });

    return token;
  } catch (err) {
    let errorMessage = 'Unknown error';
    if (err.response && err.response.data && err.response.data.message) {
      errorMessage = err.response.data.message;
    }
    yield put(setAuthError(errorMessage));
    return err;
  }
}

export function* setAuthorized(token: string) {
  try {
    yield put(setAuthToken(token));

    // Add the token to the keychain
    yield call([Keychain, Keychain.setGenericPassword], 'token', token, { accessGroup: 'group.playpost', service: 'com.aardwegmedia.playpost' });

    return token;
  } catch (err) {
    yield put(setAuthError(err));
    return err;
  }
}

export function* watchAuthorize() {
  yield takeLatest(GET_AUTH_TOKEN, authorize);
}

export function* authSaga() {
  yield all([
    watchAuthorize()
  ]);
}
