import { Access } from '../config';

// Components
import {
	Dashboard,
	Books,
	Create,
	Edit
} from 'components';

export default [
	{
		component: Dashboard,
		path: '/',
		title: 'Dashboard',
		exact: true,
	},
	{
		component: Books,
		path: '/books',
		title: 'Books',
		permission: [Access.ROLE_VIEW_ALL, Access.ROLE_VIEWER],
	},
	{
		component: Create,
		path: '/create',
		title: 'Create Book',
		permission: [Access.ROLE_CREATOR]
	},
	{
		component: Edit,
		path: '/edit',
		title: 'Edit Book',
		permission: [Access.ROLE_CREATOR]
	},

];