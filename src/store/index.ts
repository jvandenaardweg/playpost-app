import axios from 'axios';
import reduxAxiosMiddleware from 'redux-axios-middleware';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';

import reducers from '../reducers';

import { API_URL } from '../constants/api';

const client = axios.create({
  baseURL: API_URL,
  responseType: 'json',
  timeout: 10000 // 10 seconds timeout
});

export const store = createStore(
  combineReducers({
    ...reducers,
  }),
  composeWithDevTools(
    applyMiddleware(
      reduxAxiosMiddleware(client, { returnRejectedPromiseOnError: true })
    )
  )
);
