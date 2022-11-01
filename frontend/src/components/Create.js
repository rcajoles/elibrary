import React, { memo, useState } from 'react';
import { Alert, Form, Button } from 'react-bootstrap';
import { JumbotronWrapper } from './common';
import { Formik } from 'formik';
import * as yup from 'yup';
import * as api from 'api';

const schema = yup.object().shape({
	author: yup.string().required(),
	title: yup.string().required(),
	year: yup.string().required()
});

const initialValues = {
	author: '',
	title: '',
	year: ''
};

function CreateBook() {
	const [isErrorState, setErrorState] = useState(false);
	const [successState, setSuccessState] = useState(false);
	const [msgState, setMsgState] = useState(null);

	const handleSubmit = async (values, actions) => {
		actions.setSubmitting(true);
		const response = await Promise.all([api.books.create(values)]).catch((err) => {
			setTimeout(() => {
				err.response?.data
					? setMsgState(err.response.data.message)
					: setMsgState(err.message);
				setErrorState(true);
			}, 5000);
			actions.setSubmitting(false);
			actions.resetForm(initialValues);
			return err;
		});

		if (response[0].status === 200) {
			setSuccessState(true);
			setMsgState(response[0].data.message);
			actions.setSubmitting(false);
			actions.resetForm(initialValues);

			setTimeout(() => {
				setMsgState(null);
				setSuccessState(false);
			}, 5000);
		}
	};

	return (
		<JumbotronWrapper title="Create a book" description="">
			<Formik
				validationSchema={schema}
				onSubmit={handleSubmit}
				initialValues={{
					author: '',
					title: '',
					year: ''
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

						{isErrorState && <Alert variant={`danger`}>{msgState}</Alert>}

						{successState && <Alert variant={'success'}>{msgState}</Alert>}

						<Button variant="primary" type="submit" disabled={isSubmitting}>
							Create
						</Button>
					</Form>
				)}
			</Formik>
		</JumbotronWrapper>
	);
}

export default memo(CreateBook);
