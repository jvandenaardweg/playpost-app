import { SagaMiddleware } from 'redux-saga';

// import { subscriptionsSaga } from './subscriptions';
import { authSaga } from './auth';

const rootSage = [
  authSaga
];

export const initSagas = (sagaMiddleware: SagaMiddleware) => {
  return rootSage.forEach(sagaMiddleware.run.bind(sagaMiddleware));
};
