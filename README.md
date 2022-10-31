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
* `docker-compose build`.
* `docker-compose up -d`

### # Frontend
* Open your favorite terminal.
* `cd frontend`,
* `cp .env.sample .env.local`
* `yarn` or `yarn install`.
* `yarn start`
