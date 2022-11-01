import React, { memo, useState } from 'react';
import { Alert, Form, Button } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { JumbotronWrapper } from './common';
import * as api from 'api';
import { Formik } from 'formik';
import * as yup from 'yup';
import _ from 'lodash';

const schema = yup.object().shape({
	username: yup.string().required(),
	password: yup.string().required()
});

function Login() {
	const [isErrorState, setErrorState] = useState(false);
	const [isErrorMsg, setErrorMsg] = useState('');
	const initalValues = {
		username: '',
		password: ''
	};
	let history = useHistory();

	const handleSubmit = (data, actions) => {
		actions.setSubmitting(true);
		Promise.all([api.auth.login(data)])
      .then((res) => {
				if (res[0].status === 200) {
					const { id, username, email, roles, accessToken } = res[0].data;

					localStorage.setItem('_id', id);
					localStorage.setItem('username', username);
					localStorage.setItem('email', email);
					localStorage.setItem('roles', JSON.stringify(roles));
					localStorage.setItem('accessToken', accessToken);

					actions.resetForm(initalValues);
					actions.setSubmitting(false);
					history.push('/app');
				}
				return res;
			})
			.catch((err) => {
				setErrorState(true);
				setErrorMsg(err.message);
				actions.setSubmitting(false);
				actions.resetForm(initalValues);
				if (_.has(err, 'response') && err.response.data.message) {
					setErrorMsg(err.response.data.message);
				} else {
					setErrorMsg(err.message);
				}
				return err;
			});
	};

	return (
		<JumbotronWrapper title="Login" description="">
			<Formik
				validationSchema={schema}
				onSubmit={handleSubmit}
				initialValues={initalValues}
			>
				{({
					handleSubmit,
					handleChange,
					handleBlur,
					values,
					touched,
					isValid,
					errors,
					action,
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

						<Form.Group className="mb-3" controlId="password">
							<Form.Label>Password</Form.Label>
							<Form.Control
								isInvalid={!!errors.password && values.password.length < 6}
								isValid={
									values.password.length > 5 &&
									touched.password &&
									!errors.password
								}
								onChange={handleChange}
								name="password"
								value={values.password}
								type="password"
								placeholder="Enter password"
								required
							/>
							<Form.Control.Feedback type="invalid">
								{errors.password}
							</Form.Control.Feedback>
						</Form.Group>

						{isErrorState && <Alert variant={`danger`}>{isErrorMsg}</Alert>}

						<div className="text-right">
							<Link to="/register">Register</Link>
						</div>
						<Button variant="primary" type="submit" disabled={isSubmitting}>
							Login
						</Button>
					</Form>
				)}
			</Formik>
		</JumbotronWrapper>
	);
}

export default memo(Login);
