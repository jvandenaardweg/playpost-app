// import * as Keychain from 'react-native-keychain';
import { Platform } from 'react-native';
import { AnyAction } from 'redux';
// tslint:disable-next-line:no-submodule-imports
import { all, call, put, takeLatest } from 'redux-saga/effects';

export const keychainArguments = Platform.select({
  ios: { accessGroup: 'group.playpost', service: 'com.aardwegmedia.playpost' },
  android: { service: 'com.aardwegmedia.playpost' }
});

import * as API from '../api/auth';
import { GET_AUTH_TOKEN, resetAuthError, setAuthError, setAuthToken } from '../reducers/auth';

export function* authorize({ email, password }: AnyAction) {
  try {
    // Reset the error message that's maybe there from a previous request
    yield put(resetAuthError());

    // Get a token from the API
    const { data } = yield call(API.getAuthToken,  email, password);
    const token = data.token;

    if (!token) {
      throw new Error('Did not receive the correct data from the server. Please try again.');
    }

    // Save the token in the store
    yield put(setAuthToken(token));

    // Save the token in the Keychain, so it can be re-used by our Share App ánd be picked up by Axios as Authorization headers
    // yield call(Keychain.setGenericPassword, 'token', token, keychainArguments);
    // yield call([Keychain, Keychain.setGenericPassword], 'token', token, keychainArguments);

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

export function* watchAuthorize() {
  yield takeLatest(GET_AUTH_TOKEN, authorize);
}

export function* authSaga() {
  yield all([
    watchAuthorize()
  ]);
}
