import React, { memo, useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
import { Alert, Form, Button } from 'react-bootstrap';
import { Formik } from 'formik';
// import _ from 'lodash';
import * as yup from 'yup';
import * as api from 'api';

const schema = yup.object().shape({
	author: yup.string().required(),
	title: yup.string().required(),
	year: yup.string().required()
});

function Edit({ data, active, ...props }) {
	const [isErrorState, setErrorState] = useState(false);
	const [successState, setSuccessState] = useState(false);
	const [msgState, setMsgState] = useState(null);
  const [initialValue, setInitialValue] = useState({});
  const value = { author: '', title: '', year: '' };

  const handleSubmit = async (values, actions) => {
    actions.setSubmitting(true);
    const response = await Promise.all([api.books.update(values)])
      .catch((err) => {
        setMsgState(err.message);
        setErrorState(true);
        actions.setSubmitting(false);
        setInitialValue(value);
        return err;
      });

    if (response[0].status === 200) {
      setMsgState(response[0].data.message);
      setSuccessState(true);

      setTimeout(() => {
        setMsgState(null);
        setSuccessState(false);
        actions.setSubmitting(false);
        setInitialValue(value);
      }, 5000);
    }
    return response;
  }


  useEffect(() => {
    setInitialValue({ _id: data._id , author: data.author, title: data.title, year: data.year });
  }, [data])


	return (
		<>
      <Formik
				validationSchema={schema}
				onSubmit={handleSubmit}
        initialValues={initialValue}
        enableReinitialize={true}
			>
				{({
					handleSubmit,
					handleChange,
					handleBlur,
					values,
					touched,
					isValid,
					errors,
					actions,
					isSubmitting
				}) => (
					<Form noValidate onSubmit={handleSubmit}>
						<Form.Group className="mb-3" controlId="author">
							<Form.Label>Author</Form.Label>
							<Form.Control
								isInvalid={!!errors.author}
								isValid={touched.author && !errors.author}
								onChange={handleChange}
								name="author"
								value={values.author}
								type="text"
								placeholder="Enter Author"
								required
							/>
							<Form.Control.Feedback type="invalid">
								{errors.author}
							</Form.Control.Feedback>
						</Form.Group>

						<Form.Group className="mb-3" controlId="title">
							<Form.Label>Title</Form.Label>
							<Form.Control
								isInvalid={!!errors.title}
								isValid={touched.title && !errors.title}
								onChange={handleChange}
								name="title"
								value={values.title}
								type="text"
								placeholder="Enter Title"
								required
							/>
							<Form.Control.Feedback type="invalid">
								{errors.title}
							</Form.Control.Feedback>
						</Form.Group>

						<Form.Group className="mb-3" controlId="year">
							<Form.Label>Year</Form.Label>
							<Form.Control
								isInvalid={!!errors.year}
								isValid={touched.year && !errors.year}
								onChange={handleChange}
								name="year"
								value={values.year}
								type="text"
								placeholder="Enter Year"
								required
							/>
							<Form.Control.Feedback type="invalid">
								{errors.year}
							</Form.Control.Feedback>
						</Form.Group>
            {successState && <Alert variant={'success'}>{msgState}</Alert>}
						{isErrorState && <Alert variant={`danger`}>{msgState}</Alert>}
						<Button variant="primary" type="submit" disabled={isSubmitting}>
							Submit
						</Button>
					</Form>
				)}
			</Formik>
		</>
	);
}

export default memo(Edit);
