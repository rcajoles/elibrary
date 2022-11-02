import React, { memo, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { JumbotronWrapper, DataTable } from './common';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Dropdown from 'react-bootstrap/Dropdown';
import EditBook from './Edit';
import * as api from 'api';
import _ from 'lodash';

function BookList() {

  const [dataTableBooks, setDataTableBooks] = useState([]);
  const { old, recent, id } = useParams();
  const params = { old, recent, id };

  const [modalData, setModalData] = useState({});
  const [show, setShow] = useState(false);
  const [successDeleteState, setSuccessDeleteState] = useState(false);
  const [deleteState, setDeleteState] = useState(false);
  const [deleteMsg, setDeleteMsg] = useState(null);
  const [spinnerState, setSpinnerState] = useState(false);

  const handleEditModalClose = () => {
    setShow(false);
    window.location.reload();
  };
  const handleEditModalShow = () => setShow(true);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDeleteConfirmClose = () => {
    setShowDeleteConfirm(false);
    window.location.reload();
  };
  const handleDeleteConfirmShow = (event) => {
    const data = getDataTableRowData(event);
    setShowDeleteConfirm(true);
    setModalData(data);
  };

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

  const confirmDeleteBookData = async (args) => {
    setSpinnerState(true);
    setDeleteState(true);
    setDeleteMsg('Book record is currently being deleted.')

    const response = await Promise.all([api.books.deleteBook(modalData)])
      .catch((err) => {
        if (err?.response) {
          setDeleteMsg(err.response.data.message);
        } else {
          setDeleteMsg(err.message);
        }
        setSpinnerState(false);
        setDeleteState(false);
        setSuccessDeleteState(true);
        return err;
      });

    if (response[0]?.status === 200 && response[0]?.data) {
      const data = response[0]?.data;
      setSpinnerState(false);
      setDeleteState(false);
      setDeleteMsg(data.message);
      setSuccessDeleteState(true);
    }
    return response;
  };

  useCallback(getBooks(params), [show]);

  const actionButtonEdit = (event) => {
    const data = getDataTableRowData(event);

    setModalData(data);
    handleEditModalShow();
  };

  const rowClickHandler = (row, event) => {
    setModalData(row);
    handleEditModalShow();
  };

  const getDataTableRowData = (event) => {
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

    return data;
  }

  const editBookModal = () => {
    return (
      <Modal show={show} onHide={handleEditModalClose}>
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
          show={showDeleteConfirm}
          onHide={handleDeleteConfirmClose}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>Confirm deletion?</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            { !successDeleteState ? `Are you sure you wanna delete this book record?` : deleteMsg }
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleDeleteConfirmClose} disabled={deleteState}>
              Close
            </Button>
            { !successDeleteState &&
            <Button variant="danger" onClick={confirmDeleteBookData} disabled={deleteState}>
              {deleteState && spinnerState ?
                (<>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />
                    <span className="visually-hidden">Loading...</span>
                </>) : `Understood`}
            </Button>
            }
          </Modal.Footer>
        </Modal>
      </>
    );
  };

  // DATA TABLE COLUMN
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
      selector: (row) => row.createdAt,
      sortable: true,
      format: (row) => row.createdAt ? new Date(row.createdAt).toUTCString() : '',
    },
    {
      name: 'Actions',
      selector: (row) =>
        row.createdAt ? new Date(row.createdAt).toUTCString() : row.createdAt,
      sortable: true,
      button: true,
      allowOverflow: true,
      cell: (row, index, column, id) => {
        return (
          <>
            <Dropdown
              size="sm"
              drop="up"
            >
              <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                {spinnerState ?
                  (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />
                    </>
                  ) : 'Action' }
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item as="button" title="Edit book" onClick={actionButtonEdit}>Edit</Dropdown.Item>
                <Dropdown.Item as="button" title="Delete book" onClick={handleDeleteConfirmShow}>Delete</Dropdown.Item>
              </Dropdown.Menu>

            </Dropdown>
          </>
        );
      },
    }
  ];

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
