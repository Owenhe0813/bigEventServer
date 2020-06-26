const mysql = require('mysql');

function db(queryString, data = null) {
    const conn = mysql.createConnection({
        user: 'root',
        password: 'he131059',
        host: 'localhost',
        database: 'bigeventserver'
    });
    conn.connect();
    return new Promise((resolve, reject) => {
        conn.query(queryString, data, (err, data) => {
            err ? reject(err) : resolve(data);
        });
    });
    conn.end();
}

module.exports = db;