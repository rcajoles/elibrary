import React, { Fragment } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Login, Register } from 'components';

function PublicRoutes() {
	return (
		<Fragment>
			<Switch>
				<Route path="/register">
					<Register />
				</Route>
				<Route path="">
					<Login />
				</Route>
			</Switch>
		</Fragment>
	);
}

export default PublicRoutes;
