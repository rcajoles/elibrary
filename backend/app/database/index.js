const db = require('../model'),

    database = function () {
        let conn = null;
        const connect = function (config) {

            db.mongoose
                .connect(`mongodb://${config.HOST}:${config.PORT}/${config.DB}`, {
                    useNewUrlParser: true,
                    useUnifiedTopology: true
                })
                .then(() => {
                    console.log('Successfully connected to MongoDB.');
                    // Seed initial user Roles
                    initializeSeed();
                })
                .catch(err => {
                    console.error('Connection error', err);
                    process.exit();
                });

            conn = db.mongoose.connection;
            conn.on('error', console.error.bind(console, 'connection error:'));
            conn.once('open', function () {
                console.log('db connection open');
            });
            return conn;
        },

        close = function () {
            if (conn) {
                conn.close(function () {
                    console.log('Mongoose default connection disconnected through app termination');
                    process.exit(0);
                });
            }
        };

        return {
            connect,
            close
        };
    }();

function initializeSeed() {
    const roleModel = require('./RoleSeeder.db');
    roleModel.seeder();
}

module.exports = database;
