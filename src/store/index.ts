import axios from 'axios';
import axiosMiddleware from 'redux-axios-middleware';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import rootReducer from '../reducers';

import { API_URL } from '../constants/api';

const client = axios.create({
  baseURL: API_URL,
  responseType: 'json',
  timeout: 10000 // 10 seconds timeout
});

/* eslint-disable no-underscore-dangle */
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(
  combineReducers({
    ...rootReducer,
  }),
  composeEnhancers(
    applyMiddleware(
      axiosMiddleware(client)
    )
  )
);
