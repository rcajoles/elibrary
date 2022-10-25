require("dotenv").config();

const express = require('express');
const cors = require('cors');
const dbConfig = require('./app/config/db.config');

const app = express();

const corsOptions = {
  origin: `${process.env.APP_URI}:${process.env.CORS_OPTION_PORT}`
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const db = require('./app/model');
const Role = db.role;

main().catch(err => console.log(err));

async function main() {
    await db.mongoose
      .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      })
      .then(() => {
        console.log('Successfully connect to MongoDB.');
        initial();
      })
      .catch(err => {
        console.error('Connection error', err);
        process.exit();
      });
}

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
  console.log(`Server is running on port ${PORT}.`);
});

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: 'user'
      }).save(err => {
        if (err) {
          console.log('error', err);
        }

        console.log(`added 'user' to roles collection`);
      });

      new Role({
        name: 'moderator'
      }).save(err => {
        if (err) {
          console.log('error', err);
        }

        console.log(`added 'moderator' to roles collection`);
      });

      new Role({
        name: 'admin'
      }).save(err => {
        if (err) {
          console.log('error', err);
        }

        console.log(`added 'admin' to roles collection`);
      });
    }
  });
}
