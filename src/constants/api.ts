const PRODUCTION_API_URL = 'https://api.postplay.app';
const STAGING_API_URL = 'https://api-staging.postplay.app';
const DEVELOPMENT_API_URL = 'http://localhost:3000';

interface ApiEnvironments {
  [key: string]: string;
}

const environments: ApiEnvironments = {
  production: PRODUCTION_API_URL,
  staging: STAGING_API_URL,
  development: DEVELOPMENT_API_URL
};

export const API_URL = environments[process.env.NODE_ENV || 'production'];
