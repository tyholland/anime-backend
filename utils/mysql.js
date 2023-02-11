const mysql = require('mysql');
const util = require('util');
let connection;

const connectToDB = () => {
  connection = mysql.createConnection({
    host: process.env.REACT_APP_MYSQL_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.REACT_APP_MYSQL_PORT,
  });

  connection.connect();
  return util.promisify(connection.query).bind(connection);
};

module.exports.instance = () => {
  if (connection) {
    return util.promisify(connection.query).bind(connection);
  }

  return connectToDB();
};
