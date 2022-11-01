import React, { memo } from 'react';
import PropTypes from 'prop-types';
import DataTable from 'react-data-table-component';

const columns = [];

const data = [];

const CustomDataTable = ({ data, title, columns, onRowClicked, progressPending }) => {
	return (
		<>
      <DataTable
        progressPending={progressPending}
        persistTableHead={true}
        onRowClicked={onRowClicked}
				title={title}
				columns={columns}
        data={data}
				pagination
				selectableRows
				subHeaderComponent
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
