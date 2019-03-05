import { PRODUCTION_API_URL } from '../constants/Api';

const headers = {
  'Content-Type': 'application/json',
};

export const getMe = async (token) => {
  headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${PRODUCTION_API_URL}/v1/me`, { headers, method: 'GET' });
  const data = await response.json();

  if (!response.ok) {
    if (!data.message) return new Error('Getting your account details failed.');
    return new Error(data.message);
  }

  return data;
};
