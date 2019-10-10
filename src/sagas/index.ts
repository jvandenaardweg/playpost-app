import { SagaMiddleware } from 'redux-saga';

// import { subscriptionsSaga } from './subscriptions';
import { authSaga } from './auth';
import { playlistSaga } from './playlist';

const rootSage = [
  authSaga,
  playlistSaga
];

export const initSagas = (sagaMiddleware: SagaMiddleware) => {
  return rootSage.forEach(sagaMiddleware.run.bind(sagaMiddleware));
};
