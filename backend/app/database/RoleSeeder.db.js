const db = require('../model'),
      Role = db.role;

const RoleSeeder = function () {
    const seeder = function () {
        Role.estimatedDocumentCount((err, count) => {
            if (!err && count === 0) {
                new Role({
                    name: 'viewer'
                }).save(err => {
                    if (err) {
                        console.log('error', err);
                    }

                    console.log(`added 'viewer' to roles collection`);
                });

                new Role({
                    name: 'creator'
                }).save(err => {
                    if (err) {
                        console.log('error', err);
                    }

                    console.log(`added 'creator' to roles collection`);
                });
            }
        });
    };

    return {
        seeder
    };

}();

module.exports = RoleSeeder;
