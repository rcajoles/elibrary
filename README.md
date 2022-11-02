# E-Library app

This is a small ebook library app

### Requirements:

* Docker Desktop
* Node v16+
* Yarn (latest)
#### Required software's should be already be installed locally before setting up local development

<br />

## Local Development
### # Backend
* Open your favorite terminal.
* Clone app from repo  &nbsp; `https://github.com/rcajoles/elibrary`
* cd inside the root folder, then `cd /backend`
* `cp .env.sample .env.local`
* `docker-compose build`
* `docker-compose up -d`

### # Frontend
* Open your favorite terminal.
* `cd frontend`
* `cp .env.sample .env.local`
* `yarn` or `yarn install`
* `yarn start`

<br />

```

Notes:
- You can import the postman collection to your own favorite API testing application to test the projects backend endpoints, it includes CRUD response examples for reference.

- Seed only includes the preset user roles, so you have to register manually through the UI.

- Same scenario with the books, you have to create through the UI (only applicable to 'creator' role).

```
