const mysql = require('mysql');
const util = require('util');
let connection;

const connectToDB = () => {
  connection = mysql.createConnection({
    host: process.env.REACT_APP_MYSQL_HOST,
    user: process.env.REACT_APP_MYSQL_USER,
    password: process.env.REACT_APP_MYSQL_PWD,
    database: process.env.REACT_APP_MYSQL_NAME,
    port: process.env.REACT_APP_MYSQL_PORT,
    socketPath: process.env.INSTANCE_UNIX_SOCKET || '',
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
