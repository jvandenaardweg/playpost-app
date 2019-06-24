import { apiClient } from './index';

export const getAuthToken = (email: string, password: string) => {
  return apiClient.post('/v1/auth', { email, password });
};
