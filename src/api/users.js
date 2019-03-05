import { DEVELOPMENT_API_URL } from '../constants/Api';

export const API_CREATE_USER_URL = `${DEVELOPMENT_API_URL}/v1/users`;

// const headers = {
//   'Content-Type': 'application/json',
// };

// export const createUser = async (email, password) => {
//   const credentials = JSON.stringify({
//     email,
//     password
//   });

//   const response = await fetch(`${PRODUCTION_API_URL}/v1/users`, { headers, method: 'POST', body: credentials });
//   const data = await response.json();

//   if (!response.ok) {
//     if (!data.message) return new Error('Creating failed.');
//     return new Error(data.message);
//   }

//   return data;
// };
