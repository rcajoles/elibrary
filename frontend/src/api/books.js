import axios from 'axios';

const app_uri = `${process.env.REACT_APP_BASE_API}`;


const read = async (query) => {
  const token = getToken('accessToken') ?? null;

  if (query?.id) {
    query[`_id`] = query.id;
  }

  const params = { data: { ...query } };
  const endpoint = `/api/books`;
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'x-access-token': `${token}`,
      'Content-Type': `application/json`
    },
    params
  };
	const url = `${app_uri}${endpoint}`;
	const response = await axios.get(url, config);
	return response;
};

const create = async (params) => {
  const token = getToken('accessToken') ?? null;
	const { author, title, year } = params;

	const payload = {
		author,
		title,
		year
	};

	const endpoint = `/api/books`;
	const url = `${app_uri}${endpoint}`;
	const response = await axios.post(url, payload, {
		headers: {
			Authorization: `Bearer ${token}`,
			'x-access-token': `${token}`,
			'Content-Type': `application/json`
		}
	});

	return response;
};

const update = async (params) => {
  const token = getToken('accessToken') ?? null;
	const { _id, author, title, year } = params;

	const payload = {
		_id,
		author,
		title,
		year
	};

	const endpoint = `/api/books`;
	const url = `${app_uri}${endpoint}`;
	const response = await axios.put(url, payload, {
		headers: {
			Authorization: `Bearer ${token}`,
			'x-access-token': `${token}`,
			'Content-Type': `application/json`
		}
	});

	return response;
};

const deleteBook = async (params) => {
  const token = getToken('accessToken') ?? null;
	const { _id } = params;

	const endpoint = `/api/books/delete`;
	const url = `${app_uri}${endpoint}`;
	const response = await axios.post(
		url,
		{ _id },
		{
			headers: {
				Authorization: `Bearer ${token}`,
				'x-access-token': `${token}`,
				'Content-Type': `application/json`
			}
		}
	);

	return response;
};

const getToken = (args) => {
  return localStorage.getItem(args);
};

const endpoints = {
  read,
  create,
  update,
  deleteBook,
};

export default endpoints;
