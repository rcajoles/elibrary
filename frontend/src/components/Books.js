import React, { memo, useEffect } from 'react';
import { JumbotronWrapper } from './common';
import { DataTable } from './common';
import { read } from 'api';

function Books() {
	// const [books, setBooks] = useState([]);

	const getBooks = async (data) => {
		await Promise.all([read()])
			.then((res) => {
				console.log(res);
				if (res[0].status === 200) {
					// const {
					// 	id,
					// 	username,
					// 	email,
					// 	roles,
					// 	accessToken
					// } = res[0].data;

				}
				return res;
			})
			.catch((err) => {
				console.log(err);
				return err;
			});
	};

	useEffect(() => {
		getBooks();
	}, []);

	return (
		<JumbotronWrapper title="Library" col={{ lg: '10' }} description="">
			<DataTable title="Books" />;
		</JumbotronWrapper>
	);
}

export default memo(Books);
