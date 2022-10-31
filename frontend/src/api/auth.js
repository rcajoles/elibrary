import axios from 'axios';

const app_uri = `${process.env.REACT_APP_BASE_API}`;

console.log(`Listening to: ${app_uri}`);

export const signup = async (param) => {
  const {
    username,
    email,
    password,
    roles
  } = param;

  const endpoint = `/api/auth/signup`;
  const url = `${app_uri}${endpoint}`;
  const response = await axios.post(url, {
    username,
    email,
    password,
    roles
  },
  {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Allow-Headers': '*',
      'Content-Type': `application/json`,
    },
  });

  return response;
};

export const login = async (param) => {
  const {
    username,
    password
  } = param;

  const endpoint = `/api/auth/signin`;
  const url = `${app_uri}${endpoint}`;

  const response = await axios.post(url, { username, password },
    {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Allow-Headers': '*',
      'Content-Type': `application/json`,
    },
  });

  return response;
};
