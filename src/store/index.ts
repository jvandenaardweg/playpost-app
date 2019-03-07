import axios from 'axios';
import axiosMiddleware from 'redux-axios-middleware';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';

import rootReducer from '../reducers';

import { API_URL } from '../constants/api';

const client = axios.create({
  baseURL: API_URL,
  responseType: 'json',
  timeout: 10000 // 10 seconds timeout
});

export const store = createStore(
  combineReducers({
    ...rootReducer,
  }),
  composeWithDevTools(
    applyMiddleware(
      axiosMiddleware(client)
    )
  )
);
