import axios from 'axios';

export const getAuthToken = (email: string, password: string) => {
  return axios.post('http://localhost:3000/v1/auth', { email, password })
  // .catch((err) => {
  //   // Return the server error message
  //   if (err.response && err.response.data && err.response.data.message) {
  //     throw err.response.data.message;
  //   }

  //   throw err;
  // });
};
