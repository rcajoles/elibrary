import axios from 'axios';

const app_uri = `${process.env.REACT_APP_BASE_API}`;
const token = !!localStorage.getItem('accessToken') ? localStorage.getItem('accessToken') : null;

export const read = async (params) => {
  const endpoint = `/api/books`;
  const url = `${app_uri}${endpoint}`;
  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      'x-access-token': `${token}`,
      'Content-Type': `application/json`,
    },
  });

  return response;
};

export const create = async (params) => {
  const {
    author,
    title,
    year,
  } = params;

  const payload = {
    author,
    title,
    year,
  };

  const endpoint = `/api/books`;
  const url = `${app_uri}${endpoint}`;
  const response = await axios.post(url, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
      'x-access-token': `${token}`,
      'Content-Type': `application/json`,
    },
  });

  return response;
};


export const update = async (params) => {
  const {
    _id,
    author,
    title,
    year,
  } = params;

  const payload = {
    _id,
    author,
    title,
    year,
  };

  const endpoint = `/api/books`;
  const url = `${app_uri}${endpoint}`;
  const response = await axios.put(url, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
      'x-access-token': `${token}`,
      'Content-Type': `application/json`,
    },
  });

  return response;
};


export const deleteBook = async (params) => {
  const {
    _id
  } = params;

  const endpoint = `/api/books/delete`;
  const url = `${app_uri}${endpoint}`;
  const response = await axios.post(url, { _id }, {
    headers: {
      Authorization: `Bearer ${token}`,
      'x-access-token': `${token}`,
      'Content-Type': `application/json`,
    },
  });

  return response;
};
