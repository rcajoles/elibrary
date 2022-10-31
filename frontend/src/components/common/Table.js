import React, { memo } from 'react';
import PropTypes from 'prop-types';
import DataTable from 'react-data-table-component';
// import CustomMaterialPagination from './CustomMaterialPagination';


const columns = [
    {
        name: 'Author',
        selector: row => row.author,
        sortable: true,
    },
    {
        name: 'Title',
        selector: row => row.title,
        sortable: true,
    },
    {
        name: 'Year',
        selector: row => row.year,
        sortable: true,
    },
    {
        name: 'Created',
        selector: row => row.createdAt,
        sortable: true,
        button: true
    },
];

const data = [
	{
		id: 1,
		author: 'Jose Rizal',
        title: 'Beetlejuice',
        year: '1988',
	},
	{
        id: 2,
        author: 'Jose Rizal',
		title: 'Ghostbusters',
		year: '1984',
	},
];


const Table = (props) => {
    return (
        <>
            <DataTable
                title={props.title}
                columns={props.columns}
                data={props.data}
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

Table.propTypes = {
    title: PropTypes.string,
    columns: PropTypes.array,
    data: PropTypes.array,
};

Table.defaultProps = {
	columns,
	data
};

export default memo(Table);
