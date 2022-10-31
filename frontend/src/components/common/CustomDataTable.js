import React, { memo } from 'react';
import PropTypes from 'prop-types';
import DataTable from 'react-data-table-component';

const columns = [
	{
		name: 'Author',
		selector: (row) => row.author,
		sortable: true,
		minWidth: '13em',
		maxWidth: '20em'
	},
	{
		name: 'Title',
		selector: (row) => row.title,
		sortable: true,
		minWidth: '13em',
		maxWidth: '20em'
	},
	{
		name: 'Year',
		selector: (row) => row.year,
		sortable: true,
		minWidth: '13em',
		maxWidth: '20em'
	},
	{
		name: 'Created',
		selector: (row) =>
			row.createdAt ? new Date(row.createdAt).toUTCString() : row.createdAt,
		sortable: true,
		button: true,
		minWidth: '13em',
		maxWidth: '20em'
	}
];

const data = [];

const CustomDataTable = ({ data, title, columns }) => {
	return (
		<>
			<DataTable
				title={title}
				columns={columns}
				data={data}
				pagination
				selectableRows
				subHeaderComponent
				dense
				highlightOnHover
				pointerOnHover
			/>
		</>
	);
};

CustomDataTable.propTypes = {
	title: PropTypes.string,
	columns: PropTypes.array,
	data: PropTypes.array
};

CustomDataTable.defaultProps = {
	columns,
	data
};

export default memo(CustomDataTable);
