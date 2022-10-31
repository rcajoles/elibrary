import React, { memo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Alert, Form, Button } from 'react-bootstrap';
import { JumbotronWrapper } from './common';
import { Formik } from 'formik';
import * as yup from 'yup';
import * as api from 'api';

const schema = yup.object().shape({
	Author: yup.string().required(),
	email: yup.string().required(),
	Year: yup.string().required()
});

const initialValues = {
	Author: '',
	email: '',
	Year: ''
};

function Edit() {
	const [isErrorState, setErrorState] = useState(false);
	const [isErrorMsg, setErrorMsg] = useState('');

	async function handleSubmit(values, actions) {
		actions.setSubmitting(true);
    const response = await Promise.all([api.signup(values)])
      .catch((err) => {
        setErrorMsg(response.message);
        setErrorState(true);
        actions.setSubmitting(false);
        actions.resetForm(initialValues);
        return err.response.data;
      });

		if (response[0].status === 200) {
			actions.setSubmitting(false);
			actions.resetForm(initialValues);
		}
	}

	return (
		<JumbotronWrapper title="Edit a book" description="">
			<Formik
				validationSchema={schema}
				onSubmit={handleSubmit}
				initialValues={{
					Author: '',
					Title: '',
					Year: ''
				}}
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
						<Form.Group className="mb-3" controlId="Author">
							<Form.Label>Author</Form.Label>
							<Form.Control
								isInvalid={!!errors.Author}
								isValid={touched.Author && !errors.Author}
								onChange={handleChange}
								name="Author"
								value={values.Author}
								type="text"
								placeholder="Enter Author"
								required
							/>
							<Form.Control.Feedback type="invalid">
								{errors.Author}
							</Form.Control.Feedback>
						</Form.Group>

						<Form.Group className="mb-3" controlId="Title">
							<Form.Label>Title</Form.Label>
							<Form.Control
								isInvalid={!!errors.Title}
								isValid={touched.Title && !errors.Title}
								onChange={handleChange}
								name="Title"
								value={values.Title}
								type="text"
								placeholder="Enter Email"
								required
							/>
							<Form.Control.Feedback type="invalid">
								{errors.email}
							</Form.Control.Feedback>
						</Form.Group>

						<Form.Group className="mb-3" controlId="Year">
							<Form.Label>Year</Form.Label>
							<Form.Control
								isInvalid={!!errors.Year}
								isValid={touched.Year && !errors.Year}
								onChange={handleChange}
								name="Year"
								value={values.Year}
								type="text"
								placeholder="Enter Year"
								required
							/>
							<Form.Control.Feedback type="invalid">
								{errors.Year}
							</Form.Control.Feedback>
						</Form.Group>

						{isErrorState && <Alert variant={`danger`}>{isErrorMsg}</Alert>}
						<div className="text-right">
							<Link to="/login">Back to login</Link>
						</div>
						<Button variant="primary" type="submit" disabled={isSubmitting}>
							Register
						</Button>
					</Form>
				)}
			</Formik>
		</JumbotronWrapper>
	);
}

export default memo(Edit);
