const PRODUCTION_API_URL = 'https://readto-api-production.herokuapp.com';
const STAGING_API_URL = 'https://readto-api-staging.herokuapp.com';
const DEVELOPMENT_API_URL = 'http://localhost:3000';

const environments = {
  production: PRODUCTION_API_URL,
  staging: STAGING_API_URL,
  development: DEVELOPMENT_API_URL
};

export const API_URL = environments[process.env.NODE_ENV];
