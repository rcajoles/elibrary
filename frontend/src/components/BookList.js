import React, { memo, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { JumbotronWrapper, DataTable } from './common';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
// import Spinner from 'react-bootstrap/Spinner';
import Dropdown from 'react-bootstrap/Dropdown';
import EditBook from './Edit';
import * as api from 'api';
import _ from 'lodash';

function BookList() {
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
    },
    {
      name: 'Actions',
      selector: (row) =>
        row.createdAt ? new Date(row.createdAt).toUTCString() : row.createdAt,
      sortable: true,
      button: true,
      cell: (row, index, column, id) => {
        return (
          <>
            <Dropdown
              size="sm"
              alignRight={true}
              align={{ sm: "end" }}
              drop="down"
            >
              <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                Action
                {/* {<Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
                &nbsp; loading..} */}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item as="button" title="Edit book" onClick={actionButtonEdit}>Edit</Dropdown.Item>
                <Dropdown.Item as="button" title="Delete book" onClick={handleConfirmShow}>Delete</Dropdown.Item>
              </Dropdown.Menu>

            </Dropdown>
          </>
        );
      },
    }
  ];

  const [dataTableBooks, setDataTableBooks] = useState([]);
  const { old, recent, id } = useParams();
  const params = { old, recent, id };

  const [modalData, setModalData] = useState({});
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [showConfirm, setShowConfirm] = useState(false);

  const handleConfirmClose = () => setShowConfirm(false);
  const handleConfirmShow = () => setShowConfirm(true);


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

  const deleteBook = async (args) => {
    const response = await Promise.all([api.books.deleteBook(args)])
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

  const actionButtonEdit = (event) => {
    const rowChildren = event.target.closest('div[role="row"]').children
    const rowToArray = Array.from(rowChildren);
    const data = {
      author: '',
      title: '',
      year: '',
      _id: ''
    };

    rowToArray.forEach((element, index) => {
      if (_.inRange(index, 1, 5)) {
        switch (index) {
          case 1:
            data._id = element.lastChild.innerText;
            break;
          case 2:
            data.author = element.lastChild.innerText;
            break;
          case 3:
            data.title = element.lastChild.innerText;
            break;
          case 4:
            data.year = element.lastChild.innerText;
            break;

          default:
            break;
        }
      }
    });

    console.log(data);
    setModalData(data);
    handleShow();
  };

  const rowClickHandler = (row, event) => {
    console.log(row);
    console.log(event);
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
  };

  const modalConfirmDelete = () => {
    return (
      <>
        <Modal
          show={showConfirm}
          onHide={handleConfirmClose}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>Confirm deletion?</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you wanna delete this book record?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleConfirmClose}>
              Close
            </Button>
            <Button variant="danger" onClick={deleteBook}>Understood</Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  };

	return (
		<JumbotronWrapper title="Library" col={{ lg: '10' }} description="">
      <DataTable
        columns={columns}
        onRowClicked={rowClickHandler}
				title="Books"
				data={dataTableBooks}
        direction="auto"
        dense
      />
      {editBookModal && editBookModal()}
      {modalConfirmDelete && modalConfirmDelete()}
		</JumbotronWrapper>
	);
}

export default memo(BookList);
