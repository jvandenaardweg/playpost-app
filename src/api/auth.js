import { API_URL } from '../constants/api';

export const API_AUTH_URL = `${API_URL}/v1/auth`;

// const headers = {
//   'Content-Type': 'application/json',
// };

// export const postAuth = async (email, password) => {
//   const credentials = JSON.stringify({
//     email,
//     password
//   });

//   const response = await fetch(`${PRODUCTION_API_URL}/v1/auth`, { headers, method: 'POST', body: credentials });
//   const data = await response.json();

//   if (!response.ok) {
//     if (!data.message) return new Error('Authentication failed.');
//     return new Error(data.message);
//   }

//   return data.token;
// };
