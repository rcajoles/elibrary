require("dotenv").config();
require("reflect-metadata");

const express = require('express'),
      cors = require('cors'),
      dbConfig = require('./app/config/db.config'),
      fs = require('fs'),
      path = require('path'),
      morgan = require('morgan'),
      app = express(),

      corsOptions = {
        origin: `${process.env.APP_URI}:${process.env.CORS_OPTION_PORT}`
      };

app.use(cors(corsOptions));

// create a write stream (in append mode)
const accessLogStream = fs.createWriteStream(path.join(__dirname, '/logs/access.log'), { flags: 'a' });
app.use(morgan('combined', { stream: accessLogStream }));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const database = require('./app/database');

database.connect(dbConfig);

// simple route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to e-library API endpoint.' });
});

// router
require('./app/router/auth.router')(app);
require('./app/router/user.router')(app);

// set port, listen for requests
const PORT = process.env.NODE_DOCKER_PORT || 8000;

app.listen(PORT, () => {
  console.log('[%s] Listening on http://localhost:%d', app.settings.env, PORT);
});
