const PRODUCTION_API_URL = 'https://api.playpost.app';
const STAGING_API_URL = 'https://api-staging.playpost.app';
const DEVELOPMENT_API_URL = 'http://localhost:3000';

const { NODE_ENV } = process.env;

interface ApiEnvironments {
  [key: string]: string;
}

const environments: ApiEnvironments = {
  production: PRODUCTION_API_URL,
  staging: STAGING_API_URL,
  development: DEVELOPMENT_API_URL
};

const environment = (nodeEnv: string | undefined) => {
  if ((__DEV__) || !nodeEnv) return environments['development'];

  return environments[nodeEnv];
};

export const API_URL = environment(NODE_ENV);
