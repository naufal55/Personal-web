
const {Pool} = require('pg')

// const dbPool = new Pool({
//     database: 'db-personal-web',
//     port: 5432,
//     user: 'postgres',
//     password: '1234'
// })
const isProduction = process.env.NODE_ENV === "production";
let dbPool

if (isProduction) {
    dbPool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false,
        },
    });
} else {

    dbPool = new Pool({
        database: 'dbih98uphj7mcb',
        port: 5432,
        user: 'hxpnzjtxlqsgzh',
        password: '53278b5bdbf4db0430835bbfb9730fa9dfd348d036cc3a2ca4ccfbcb8885cc0a'

        // database: 'db-personal-web',
        // port: 5432,
        // user: 'postgres',
        // password: '1234'
    })

}

module.exports = dbPool