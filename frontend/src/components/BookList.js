import React, { memo, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { JumbotronWrapper, DataTable } from './common';
import * as api from 'api';
import _ from 'lodash';
import Modal from 'react-bootstrap/Modal';
import EditBook from './Edit';

const columns = [
	{
		name: 'ID',
		selector: (row) => row._id,
    sortable: true,
	},
	{
		name: 'Author',
		selector: (row) => row.author,
		sortable: true,
	},
	{
		name: 'Title',
		selector: (row) => row.title,
		sortable: true,
	},
	{
		name: 'Year',
		selector: (row) => row.year,
    sortable: true
	},
	{
		name: 'Created',
		selector: (row) =>
			row.createdAt ? new Date(row.createdAt).toUTCString() : row.createdAt,
		sortable: true,
    button: true
	}
];

function BookList() {
  const [dataTableBooks, setDataTableBooks] = useState([]);
  const { old, recent, id } = useParams();
  const params = { old, recent, id };

  const [modalData, setModalData] = useState({});
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  const getBooks = async (args) => {
    const response = await Promise.all([api.books.read(args)])
      .catch((err) => {
        console.log(err);
        return err;
      });

    if (response[0]?.status === 200 && response[0]?.data) {
      const data = response[0]?.data;
      if (!_.hasIn(dataTableBooks, ['author', 'title', 'year']) && _.isEmpty(dataTableBooks)) {
        setDataTableBooks(data);
      }
    }
    return response[0]?.data;
  };

  useCallback(getBooks(params), [show]);

  const rowClickHandler = (row, event) => {
    setModalData(row);
    handleShow();
  };

  const editBookModal = () => {
    return (
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Update Book detail</Modal.Title>
        </Modal.Header>
        <Modal.Body>

          {<EditBook data={modalData} active={show} />}

        </Modal.Body>
      </Modal>
    );
  }
	return (
		<JumbotronWrapper title="Library" col={{ lg: '9' }} description="">
      <DataTable
        columns={columns}
        onRowClicked={rowClickHandler}
				title="Books"
				data={dataTableBooks}
        direction="auto"
        dense
      />;
      {editBookModal && editBookModal()}
		</JumbotronWrapper>
	);
}

export default memo(BookList);
