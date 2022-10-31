import React, { memo, useEffect, useState } from 'react';
import { JumbotronWrapper, DataTable } from './common';
import * as api from 'api';
import { toLower } from 'lodash';

function BookList() {
	const [dataTableBooks, setDataTableBooks] = useState([]);
	const [triggerAPI, setTriggerAPI] = useState(false);
  const [userRole, setUserRole] = useState([]);

  const getBooks = async (params) => {
    setDataTableBooks([]);
		const response = await Promise.all([api.read()])
			.catch((err) => {
				console.log(err);
				return err;
      });

      if (response[0].status === 200 && response[0]?.data?.data) {
        const data = response[0]?.data?.data;
        setDataTableBooks(data);
        return response[0]?.data?.data;
      }

		return response;
	};

  useEffect(() => {
    if (userRole.length < 1 && dataTableBooks) {
      setUserRole(
        JSON.parse(
          localStorage.getItem('roles'))
      );
      setDataTableBooks([]);
    }

		if (userRole.length > 0) {
			userRole.forEach((role) => {
				const removePrefix = role.replace('ROLE_', ''),
					strToLower = toLower(removePrefix);

				if (strToLower === 'viewer' || strToLower === 'view_all') {
          setTriggerAPI(true);
          setDataTableBooks([]);
				}
			});
		}
	}, [userRole, dataTableBooks]);

	useEffect(() => {
    if (triggerAPI) {
      setDataTableBooks([]);
			getBooks();
    }
  }, [triggerAPI]);

	return (
		<JumbotronWrapper title="Library" col={{ lg: '8' }} description="">
			<DataTable
				title="Books"
				data={dataTableBooks}
				direction="auto"
				fixedHeaderScrollHeight="300px"
				pagination
				responsive
				subHeaderAlign="right"
				subHeaderWrap
				dense
			/>;
		</JumbotronWrapper>
	);
}

export default memo(BookList);
