import React, { memo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Alert, Form, Button } from 'react-bootstrap';
import { JumbotronWrapper } from './common';
import { Formik } from 'formik';
import * as yup from 'yup';
import * as api from 'api';

const schema = yup.object().shape({
	username: yup.string().required(),
	email: yup.string().required(),
	password: yup.string().required(),
	roles: yup.array().required()
});

const initialValues = {
	username: '',
	email: '',
	password: '',
	roles: []
};

function Register() {
	let [selected, setSelected] = useState([]);
	let [message, setMessage] = useState(null);

	const handleSubmit = async (values, actions) => {
		values.roles = selected;
		actions.setSubmitting(true);
    const response = await Promise.all([api.signup(values)])
      .catch((err) => {
        console.log(err);
        console.log(err.response.data.message);
        actions.setSubmitting(false);
        actions.resetForm(initialValues);
        return err.response.data;
      });

		if (response[0].status === 200) {
			setMessage(response[0].data.message);
			actions.setSubmitting(false);
			actions.resetForm(initialValues);

			setTimeout(() => {
				setMessage(null);
			}, 5000);
		}
	}

	function handleRoleChange(e) {
		const { options } = e.target;
		let selected = [];

		for (let i = 0; i < options.length; i++) {
			if (options[i].selected) {
				selected.push(options[i].value);
			}
		}
		setSelected(selected);
	}

	return (
		<JumbotronWrapper title="Register" description="">
			<Formik
				validationSchema={schema}
				onSubmit={handleSubmit}
				initialValues={{
					username: '',
					email: '',
					password: '',
					roles: []
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
						<Form.Group className="mb-3" controlId="username">
							<Form.Label>Username</Form.Label>
							<Form.Control
								isInvalid={!!errors.username}
								isValid={touched.username && !errors.username}
								onChange={handleChange}
								name="username"
								value={values.username}
								type="text"
								placeholder="Enter username"
								required
							/>
							<Form.Control.Feedback type="invalid">
								{errors.username}
							</Form.Control.Feedback>
						</Form.Group>

						<Form.Group className="mb-3" controlId="email">
							<Form.Label>Email</Form.Label>
							<Form.Control
								isInvalid={!!errors.Email}
								isValid={touched.email && !errors.email}
								onChange={handleChange}
								name="email"
								value={values.email}
								type="email"
								placeholder="Enter Email"
								required
							/>
							<Form.Control.Feedback type="invalid">
								{errors.email}
							</Form.Control.Feedback>
						</Form.Group>

						<Form.Group className="mb-3" controlId="password">
							<Form.Label>Password</Form.Label>
							<Form.Control
								isInvalid={!!errors.password}
								isValid={touched.password && !errors.password}
								onChange={handleChange}
								name="password"
								value={values.password}
								type="password"
								placeholder="Enter Password"
								required
							/>
							<Form.Control.Feedback type="invalid">
								{errors.password}
							</Form.Control.Feedback>
						</Form.Group>

						<Form.Group className="sm-3" controlId="role">
							<Form.Label>Role</Form.Label>
							<Form.Control
								as="select"
								isInvalid={!!errors.roles}
								isValid={touched.role && !errors.role}
								onChange={handleRoleChange}
								name="role"
								value={selected}
								type="role"
								placeholder="Choose a role"
								required
								multiple
							>
								<option value="view_all">View All</option>
								<option value="viewer">Viewer</option>
								<option value="creator">Creator</option>
							</Form.Control>
							<Form.Control.Feedback type="invalid">
								{errors.role}
							</Form.Control.Feedback>
						</Form.Group>
						<Alert variant={message ? 'success' : 'primary'}>
							{message || `Support multi roles.`}
						</Alert>
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

export default memo(Register);
