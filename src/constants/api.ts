const PRODUCTION_API_URL = 'https://api.playpost.app';
const STAGING_API_URL = 'https://api-staging.playpost.app';
const DEVELOPMENT_API_URL = 'http://localhost:3000';

interface ApiEnvironments {
  [key: string]: string;
}

const environments: ApiEnvironments = {
  production: PRODUCTION_API_URL,
  staging: STAGING_API_URL,
  development: DEVELOPMENT_API_URL
};

export const API_URL = (__DEV__) ? environments['development'] : environments['production'];
